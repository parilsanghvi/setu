const LLM = require('./LLM');
const Config = require('./Config');

class AgentContextManager {
    constructor(agent) {
        this.agent = agent; // Reference back to the CoreAgent instance
    }

    /**
     * Efficiently estimate the token count of the current context.
     * Avoids JSON.stringify() on the entire context array to prevent memory/CPU spikes.
     */
    estimateTokenCount() {
        let totalChars = 0;
        for (const msg of this.agent.context) {
            if (msg.role && typeof msg.role === 'string') totalChars += msg.role.length;
            if (msg.content !== undefined) {
                totalChars += typeof msg.content === 'string' ? msg.content.length : this.estimateJsonLength(msg.content);
            }
            if (msg.toolCalls) {
                for (const call of msg.toolCalls) {
                    if (call.name && typeof call.name === 'string') totalChars += call.name.length;
                    if (call.args) {
                        totalChars += typeof call.args === 'string' ? call.args.length : this.estimateJsonLength(call.args);
                    }
                }
            }
            if (msg.toolResult) {
                if (msg.toolResult.name && typeof msg.toolResult.name === 'string') totalChars += msg.toolResult.name.length;
                if (msg.toolResult.content !== undefined) {
                    totalChars += typeof msg.toolResult.content === 'string' ? msg.toolResult.content.length : this.estimateJsonLength(msg.toolResult.content);
                }
            }
        }
        return totalChars / 4;
    }

    async compactContext() {
        // Approximate token count (1 token ~= 4 chars)
        const estimatedTokens = this.estimateTokenCount();
        const threshold = Config.contextCompactionThreshold;

        if (estimatedTokens < threshold) return;

        this.agent.logger.info(`🧹 Compacting context (Size: ${Math.round(estimatedTokens)} tokens)...`);
        this.agent.emit('context_compact_start', { size: estimatedTokens });

        // Keep the last 10 messages + any system messages
        // Actually, we just have a flat array.
        // Let's summarize the first 50%
        const cutOffIndex = Math.floor(this.agent.context.length / 2);
        if (cutOffIndex < 2) return; // Don't compact if too few messages

        const toSummarize = this.agent.context.slice(0, cutOffIndex);
        const toKeep = this.agent.context.slice(cutOffIndex);

        try {
            // Enhanced Summary Prompt
            const summarySystem = "You are a highly efficient memory compression system.";
            const summaryPrompt = `
Compress the following conversation into a dense, specialized System Memory.
1. PRESERVE all established decisions, project architecture, and file paths.
2. PRESERVE the user's core directives and long-term goals.
3. DISCARD casual chatter or retried errors unless they contain key learnings.
4. FORMAT as a clear, structured list of facts and state.
            `.trim();

            const summary = await LLM.generate(
                summarySystem,
                [
                    { role: 'user', content: summaryPrompt },
                    { role: 'user', content: `CONVERSATION SUBSET:\n${JSON.stringify(toSummarize)}` }
                ],
                this.agent.modelConfig.fast // Use agent-specific fast model
            );

            const summaryMsg = {
                role: 'system',
                content: `[MEMORY SUMMARY]: ${typeof summary === 'string' ? summary : JSON.stringify(summary)}`
            };

            this.agent.context = [summaryMsg, ...toKeep];
            this.agent.logger.info(`✅ Context compacted. New length: ${this.agent.context.length}`);
            this.agent.emit('context_compact_end', { newSize: this.estimateTokenCount() });

            // Log this event
            this.agent.sessionLogger.log({ type: 'compaction', summary: summaryMsg.content });

        } catch (e) {
            this.agent.logger.error(`❌ Compaction failed: ${e.message}`, e);
        }
    }

    /**
     * Recursively estimates the JSON string length of a value without serialization.
     * Used for performance critical token counting.
     */
    estimateJsonLength(obj) {
        if (obj === null) return 4; // "null"
        if (obj === undefined) return 0; // Fallback

        if (typeof obj === 'string') return obj.length + 2; // "string"
        if (typeof obj === 'number') return String(obj).length;
        if (typeof obj === 'boolean') return obj ? 4 : 5; // "true" or "false"

        if (Array.isArray(obj)) {
            let len = 2; // []
            if (obj.length > 0) len += obj.length - 1; // commas
            for (const item of obj) {
                if (item === undefined) {
                    len += 4; // "null"
                } else {
                    len += this.estimateJsonLength(item);
                }
            }
            return len;
        }

        if (typeof obj === 'object') {
            let len = 2; // {}
            const keys = Object.keys(obj);
            let validKeys = 0;
            for (const key of keys) {
                const val = obj[key];
                if (val === undefined) continue; // Skip undefined keys

                // If function, symbol, skip too (JSON.stringify behavior)
                if (typeof val === 'function' || typeof val === 'symbol') continue;

                if (validKeys > 0) len += 1; // comma
                validKeys++;

                len += key.length + 3; // "key":
                len += this.estimateJsonLength(val);
            }
            return len;
        }

        return 0;
    }
}

module.exports = AgentContextManager;
