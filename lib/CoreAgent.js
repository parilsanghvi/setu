const SkillLoader = require('./SkillLoader');
const Protocol = require('./SwarmProtocol');
const Agent = require('./Agent');
const LLM = require('./LLM');
const Config = require('./Config');
const fs = require('fs');
const { z } = require('zod');
const SessionLogger = require('./SessionLogger');

class CoreAgent extends Agent {
    constructor(name, role, scope, modelConfig = {}, bus = undefined) {
        super(name, role, scope, bus);
        this.tools = []; // List of tool definitions
        this.context = []; // Short-term memory (chat history)
        this.modelConfig = {
            main: modelConfig.main || 'expensive', // Default to expensive
            fast: modelConfig.fast || 'cheap'      // Default to cheap
        };

        // ... (existing code)

        // Load Skills & Merge Tools
        const allSkills = SkillLoader.load(); // Loads all skills in ./skills
        // We can filter by agent role if we want, but for now give all skills (generic tags)

        for (const [skillName, skill] of allSkills.entries()) {
            if (skill.tools && skill.tools.length > 0) {
                this.logger.info(`🧩 Equipped Skill: ${skillName} (${skill.tools.length} tools)`);
                this.tools.push(...skill.tools);
            }
        }
    }

    // ... (existing code)

    handleControlSignal(msg) {
        this.logger.info(`🎮 Received Control Signal: ${msg.command}`);
        if (msg.command === 'STOP') {
            this.interruptSignal = 'STOP';
            this.logger.info(`🛑 Interrupt flag SET (STOP).`);
        }
        if (msg.command === 'REDIRECT') {
            this.interruptSignal = 'REDIRECT';
            this.logger.info(`🔀 Redirecting attention...`);
            // Inject new directive immediately
            this.context.push({ role: 'user', content: `[SYSTEM INTERRUPT] Priority Override: ${msg.payload}` });

            // If idle, kickstart the loop
            if (!this.isThinking) {
                this.logger.info(`⚡ Agent was idle. kickstarting loop for Redirect...`);
                // We need a dummy recipient and msg
                this.runLoop('User', { content: msg.payload, sender: 'User', meta: { taskId: 'STEERING_OVERRIDE' } });
            }
        }
    }

    /**
     * Define the tools this agent can use.
     * @param {Array} toolsList - Array of tool objects/definitions
     */
    setTools(toolsList) {
        this.tools = toolsList;
    }

    /**
     * Override processMessage to use the standardized loop.
     * @param {Object} msg - The incoming message object
     */
    async processMessage(msg) {
        this.logger.info(`🧠 CoreAgent Processing: ${msg.content.substring(0, 50)}... [Type: ${msg.type}]`);

        // Reset interrupt on new message
        this.interruptSignal = null;

        let handlerResult = null;

        // Protocol: Handle TASK_ASSIGN
        if (msg.type === Protocol.TASK_ASSIGN) {
            this.logger.info(`📜 Received TASK_ASSIGN from ${msg.sender}. (Task: ${msg.meta?.taskId})`);

            // 1. Acknowledge Receipt
            this.speak(msg.sender, "Received task assignment.", Protocol.TASK_ACK, { taskId: msg.meta?.taskId });

            // 2. Set Context for execution
            this.context.push({ role: 'user', content: `[TASK ASSIGNMENT] ${msg.content}` });

            // 3. Log Input
            this.sessionLogger.log({ type: 'input', role: 'user', content: msg.content, sender: msg.sender, task: msg.meta?.taskId });

            try {
                // 4. Run Thinking Loop
                await this.runLoop(msg.sender, msg);

                // 5. If successful (no throw), send completion
                // The last output from runLoop via 'speak' is the result usually. 
                // But we need a formal signal.
                // Let's grab the last assistant messge as the result.
                const lastMsg = this.context[this.context.length - 1];
                const content = lastMsg.role === 'assistant' ? lastMsg.content : "Task processed.";

                this.speak(msg.sender, content, Protocol.TASK_COMPLETE, { taskId: msg.meta?.taskId });

            } catch (e) {
                this.logger.error(`❌ Task Execution Failed: ${e.message}`, e);
                this.speak(msg.sender, `Task Failed: ${e.message}`, Protocol.TASK_FAIL, { taskId: msg.meta?.taskId });
            }
            return;
        }

        // Standard Chat
        // Add user message to context
        this.context.push({ role: 'user', content: msg.content });

        if (!this.sessionLogger) {
            this.logger.error(`❌ sessionLogger is undefined!`);
            // Try to recover
            const SessionLogger = require('./SessionLogger');
            this.sessionLogger = new SessionLogger(this.name);
        }

        // Log Input
        this.sessionLogger.log({ type: 'input', role: 'user', content: msg.content, sender: msg.sender });

        // Only run the thinking loop for Chat or Task related messages
        if (msg.type === 'chat' || msg.type === Protocol.TASK_ASSIGN) {
            await this.runLoop(msg.sender, msg);
        } else {
            this.logger.info(`📝 Ignoring message type ${msg.type} for LLM Loop.`);
        }
    }

    /**
     * The Main Cycle: Input -> Think -> Tool -> Output
     */
    async runLoop(recipient, originalMsg) {
        this.logger.info(`Entering runLoop...`);
        if (this.isThinking) return;

        this._setBusyState();

        let turns = 0;
        const maxTurns = 10;

        // Clean up memory before thinking
        await this.compactContext();

        try {
            while (turns < maxTurns) {
                turns++;
                const result = await this._executeTurn(turns, recipient, originalMsg);

                if (result.action === 'RETURN') return;
                if (result.action === 'BREAK') break;
                if (result.action === 'CONTINUE') continue;
            }
        } catch (e) {
            this.logger.error(`❌ Error in runLoop: ${e.message}`, e);
            this.speak(recipient, `I encountered a cognitive error: ${e.message}`, 'error');
        } finally {
            this._setIdleState();
        }
    }

    async _executeTurn(turn, recipient, originalMsg) {
        if (this.checkInterrupt()) {
            if (this.interruptSignal === 'STOP') return { action: 'RETURN' };
            if (this.interruptSignal === 'REDIRECT') {
                this.interruptSignal = null;
                // For redirect, we continue to pick up new context
            }
        }

        // Event: Thought Start
        this.emit('thought_start', { turn, agent: this.name });

        const llmMessages = this._prepareLlmMessages();

        this.logger.info(`Calling LLM (Turn ${turn})...`);

        let response;
        try {
            response = await LLM.generate(
                this.systemPrompt,
                llmMessages,
                this.modelConfig.main, // Use agent-specific model preference
                this.tools,
                this.llmOptions
            );
            this.logger.info(`LLM Response Received:`, { response: JSON.stringify(response) });
        } catch (llmErr) {
            this.logger.error(`LLM Call Failed:`, llmErr);
            throw llmErr;
        }

        this.emit('thought_end', { turn, agent: this.name });

        if (this.checkInterrupt()) {
            if (this.interruptSignal === 'STOP') return { action: 'RETURN' };
            if (this.interruptSignal === 'REDIRECT') {
                this.interruptSignal = null;
                return { action: 'CONTINUE' };
            }
        }

        return await this._handleLlmResponse(response, recipient, originalMsg);
    }

    _setBusyState() {
        this.isThinking = true;
        this.status = 'BUSY';
        // Use injected bus or fallback is handled by Agent
        this.bus.heartbeat(this.name, this.role, this.pid, 'BUSY');
    }

    _setIdleState() {
        this.isThinking = false;
        this.status = 'IDLE';
        this.bus.heartbeat(this.name, this.role, this.pid, 'IDLE');
    }

    _prepareLlmMessages() {
        return this.context.map(m => {
            if (m.toolCalls) return { role: 'assistant', toolCalls: m.toolCalls };
            if (m.toolResults) return { role: 'user', toolResults: m.toolResults };
            if (m.toolResult) return { role: 'user', toolResult: m.toolResult };
            return { role: m.role, content: m.content };
        });
    }

    async _handleLlmResponse(response, recipient, originalMsg) {
        // Handle Text Response
        if (typeof response === 'string') {
            this.context.push({ role: 'assistant', content: response });

            // Log Output
            this.sessionLogger.log({ type: 'output', role: 'assistant', content: response });

            this.speak(recipient, response, 'chat', { taskId: originalMsg.meta?.taskId });
            return { action: 'RETURN' };
        }

        // Handle Tool Calls
        if (response && response.toolCalls) {
            this.context.push({ role: 'assistant', toolCalls: response.toolCalls });

            const toolResults = [];
            for (const call of response.toolCalls) {
                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return { action: 'RETURN' };
                    if (this.interruptSignal === 'REDIRECT') break; // Break tool loop
                }

                // Event: Tool Start
                this.emit('tool_start', { name: call.name, args: call.args, agent: this.name });

                // Notify User
                let statusMsg = `🛠️ Executing: ${call.name}`;
                if (call.args) {
                    const argStr = Object.entries(call.args)
                        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
                        .join(', ');
                    if (argStr) statusMsg += ` (${argStr})`;
                }
                this.speak(recipient, statusMsg, 'status', { taskId: originalMsg.meta?.taskId });

                const result = await this.executeTool(call);

                // Event: Tool End
                this.emit('tool_end', { name: call.name, result: result, agent: this.name });

                toolResults.push({ name: call.name, content: result });
            }

            // Bundle all tool results into one message
            if (toolResults.length === 1) {
                this.context.push({ role: 'user', toolResult: toolResults[0] });
            } else if (toolResults.length > 1) {
                this.context.push({ role: 'user', toolResults: toolResults });
            }

            if (this.interruptSignal === 'REDIRECT') {
                this.interruptSignal = null;
                return { action: 'CONTINUE' };
            }

            return { action: 'CONTINUE' };
        } else {
            this.logger.warn(`Received empty or unknown response from LLM.`);
            return { action: 'BREAK' };
        }
    }

    checkInterrupt() {
        if (this.interruptSignal) {
            this.logger.info(`🛑 Execution INTERRUPTED (Signal: ${this.interruptSignal}).`);
            return true;
        }
        return false;
    }

    /**
     * Execute a specific tool.
     * Can be overridden by subclasses for custom logic.
     */
    async executeTool(toolCall) {
        const { name, args } = toolCall;
        this.logger.info(`🛠️ Executing Tool: ${name}`, args);

        // 1. Schema Validation (if defined)
        const toolDef = this.tools.find(t => t.name === name);
        if (toolDef && toolDef.parameters) {
            // In OpenAI format, parameters is a JSON Schema. z.object(...).parse() works if we mapped it.
            // But usually tools are passed as definition objects. 
            // IF the tool definition has a 'schema' property (Client-side Zod object)
            if (toolDef.schema && toolDef.schema instanceof z.ZodType) {
                try {
                    toolDef.schema.parse(args);
                } catch (validationError) {
                    return `Tool Argument Validation Failed: ${validationError.message}`;
                }
            }
        }

        // 2. Execution

        // 2a. Dynamic Tool Execution (from Skills)
        if (toolDef && (toolDef.execute || toolDef.handler)) {
            try {
                const func = toolDef.execute || toolDef.handler;
                return await func(args, this); // Pass 'this' (agent) as context if needed
            } catch (e) {
                return `Error executing skill tool ${name}: ${e.message}`;
            }
        }

        // 2b. Internal Method Execution
        if (typeof this[name] === 'function') {
            try {
                return await this[name](args);
            } catch (e) {
                return `Error executing internal method ${name}: ${e.message}`;
            }
        }

        // Default Common Tools
        switch (name) {
            case 'read_file': return this.readFile(args);
            case 'write_file': return this.writeFile(args);
            default: return `Unknown tool: ${name}`;
        }
    }

    // --- Standard Tools Implementation ---

    async readFile({ path: filePath }) {
        try {
            try {
                await fs.promises.access(filePath);
            } catch {
                return `Error: File not found at ${filePath}`;
            }
            return await fs.promises.readFile(filePath, 'utf8');
        } catch (e) {
            return `Error reading file: ${e.message}`;
        }
    }

    /**
     * Efficiently estimate the token count of the current context.
     * Avoids JSON.stringify() on the entire context array to prevent memory/CPU spikes.
     */
    estimateTokenCount() {
        let totalChars = 0;
        for (const msg of this.context) {
            if (msg.role && typeof msg.role === 'string') totalChars += msg.role.length;
            if (msg.content) {
                totalChars += typeof msg.content === 'string' ? msg.content.length : estimateJsonLength(msg.content);
            }
            if (msg.toolCalls) {
                for (const call of msg.toolCalls) {
                    if (call.name && typeof call.name === 'string') totalChars += call.name.length;
                    if (call.args) {
                        totalChars += typeof call.args === 'string' ? call.args.length : estimateJsonLength(call.args);
                    }
                }
            }
            if (msg.toolResult) {
                if (msg.toolResult.name && typeof msg.toolResult.name === 'string') totalChars += msg.toolResult.name.length;
                if (msg.toolResult.content) {
                    totalChars += typeof msg.toolResult.content === 'string' ? msg.toolResult.content.length : estimateJsonLength(msg.toolResult.content);
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

        this.logger.info(`🧹 Compacting context (Size: ${Math.round(estimatedTokens)} tokens)...`);
        this.emit('context_compact_start', { size: estimatedTokens });

        // Keep the last 10 messages + any system messages
        // Actually, we just have a flat array.
        // Let's summarize the first 50%
        const cutOffIndex = Math.floor(this.context.length / 2);
        if (cutOffIndex < 2) return; // Don't compact if too few messages

        const toSummarize = this.context.slice(0, cutOffIndex);
        const toKeep = this.context.slice(cutOffIndex);

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
                this.modelConfig.fast // Use agent-specific fast model
            );

            const summaryMsg = {
                role: 'system',
                content: `[MEMORY SUMMARY]: ${typeof summary === 'string' ? summary : JSON.stringify(summary)}`
            };

            this.context = [summaryMsg, ...toKeep];
            this.logger.info(`✅ Context compacted. New length: ${this.context.length}`);
            this.emit('context_compact_end', { newSize: this.estimateTokenCount() });

            // Log this event
            this.sessionLogger.log({ type: 'compaction', summary: summaryMsg.content });

        } catch (e) {
            this.logger.error(`❌ Compaction failed: ${e.message}`, e);
        }
    }

    async writeFile({ path: filePath, content }) {
        try {
            await fs.promises.writeFile(filePath, content, 'utf8');
            return `Successfully wrote to ${filePath}`;
        } catch (e) {
            return `Error writing file: ${e.message}`;
        }
    }
}

/**
 * Recursively estimates the JSON string length of a value without serialization.
 * Used for performance critical token counting.
 */
function estimateJsonLength(obj) {
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
                len += estimateJsonLength(item);
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
            len += estimateJsonLength(val);
        }
        return len;
    }

    return 0;
}

module.exports = CoreAgent;
