const SkillLoader = require('./SkillLoader');
const Protocol = require('./SwarmProtocol');
const Agent = require('./Agent');
const LLM = require('./LLM');
const fs = require('fs');
const { z } = require('zod');
const SessionLogger = require('./SessionLogger');

class CoreAgent extends Agent {
    constructor(name, role, scope) {
        super(name, role, scope);
        this.tools = []; // List of tool definitions
        this.context = []; // Short-term memory (chat history)

        // ... (existing code)

        // Load Skills & Merge Tools
        const allSkills = SkillLoader.load(); // Loads all skills in ./skills
        // We can filter by agent role if we want, but for now give all skills (generic tags)

        for (const [skillName, skill] of allSkills.entries()) {
            if (skill.tools && skill.tools.length > 0) {
                console.log(`[${this.name}] 🧩 Equipped Skill: ${skillName} (${skill.tools.length} tools)`);
                this.tools.push(...skill.tools);
            }
        }
    }

    // ... (existing code)

    handleControlSignal(msg) {
        console.log(`[${this.name}] 🎮 Received Control Signal: ${msg.command}`);
        if (msg.command === 'STOP') {
            this.interruptSignal = 'STOP';
            console.log(`[${this.name}] 🛑 Interrupt flag SET (STOP).`);
        }
        if (msg.command === 'REDIRECT') {
            this.interruptSignal = 'REDIRECT';
            console.log(`[${this.name}] 🔀 Redirecting attention...`);
            // Inject new directive immediately
            this.context.push({ role: 'user', content: `[SYSTEM INTERRUPT] Priority Override: ${msg.payload}` });

            // If idle, kickstart the loop
            if (!this.isThinking) {
                console.log(`[${this.name}] ⚡ Agent was idle. kickstarting loop for Redirect...`);
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
        console.log(`[${this.name}] 🧠 CoreAgent Processing: ${msg.content.substring(0, 50)}... [Type: ${msg.type}]`);

        // Reset interrupt on new message
        this.interruptSignal = null;

        let handlerResult = null;

        // Protocol: Handle TASK_ASSIGN
        if (msg.type === Protocol.TASK_ASSIGN) {
            console.log(`[${this.name}] 📜 Received TASK_ASSIGN from ${msg.sender}. (Task: ${msg.meta?.taskId})`);

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
                console.error(`[${this.name}] ❌ Task Execution Failed: ${e.message}`);
                this.speak(msg.sender, `Task Failed: ${e.message}`, Protocol.TASK_FAIL, { taskId: msg.meta?.taskId });
            }
            return;
        }

        // Standard Chat
        // Add user message to context
        this.context.push({ role: 'user', content: msg.content });

        if (!this.sessionLogger) {
            console.error(`[${this.name}] ❌ sessionLogger is undefined!`);
            // Try to recover
            const SessionLogger = require('./SessionLogger');
            this.sessionLogger = new SessionLogger(this.name);
        }

        // Log Input
        this.sessionLogger.log({ type: 'input', role: 'user', content: msg.content, sender: msg.sender });

        // Run the Thinking Loop
        await this.runLoop(msg.sender, msg);
    }

    /**
     * The Main Cycle: Input -> Think -> Tool -> Output
     */
    /**
     * The Main Cycle: Input -> Think -> Tool -> Output
     */
    async runLoop(recipient, originalMsg) {
        console.log(`[${this.name}] Entering runLoop...`);
        if (this.isThinking) return;

        this.isThinking = true;
        let turns = 0;
        const maxTurns = 10;

        // Clean up memory before thinking
        await this.compactContext();

        try {
            while (turns < maxTurns) {
                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return;
                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        // For redirect, we might want to continue or break depending on logic
                        // Here we continue to pick up new context
                    }
                }

                turns++;

                // Event: Thought Start
                this.emit('thought_start', { turn: turns, agent: this.name });

                const llmMessages = this.context.map(m => {
                    if (m.toolCalls) return { role: 'assistant', toolCalls: m.toolCalls };
                    if (m.toolResult) return { role: 'user', toolResult: m.toolResult };
                    return { role: m.role, content: m.content };
                });

                console.log(`[${this.name}] Calling LLM (Turn ${turns})...`);

                let response;
                try {
                    response = await LLM.generate(
                        this.systemPrompt,
                        llmMessages,
                        'expensive',
                        this.tools,
                        this.llmOptions
                    );
                    console.log(`[${this.name}] LLM Response Received:`, JSON.stringify(response));
                } catch (llmErr) {
                    console.error(`[${this.name}] LLM Call Failed:`, llmErr);
                    throw llmErr;
                }

                this.emit('thought_end', { turn: turns, agent: this.name });

                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return;
                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        continue;
                    }
                }

                // Handle Text Response
                if (typeof response === 'string') {
                    this.context.push({ role: 'assistant', content: response });

                    // Log Output
                    this.sessionLogger.log({ type: 'output', role: 'assistant', content: response });

                    this.speak(recipient, response, 'chat', { taskId: originalMsg.meta?.taskId });
                    return;
                }

                // Handle Tool Calls
                if (response && response.toolCalls) {
                    this.context.push({ role: 'assistant', toolCalls: response.toolCalls });

                    for (const call of response.toolCalls) {
                        if (this.checkInterrupt()) {
                            if (this.interruptSignal === 'STOP') return;
                            if (this.interruptSignal === 'REDIRECT') break;
                        }

                        // Event: Tool Start
                        this.emit('tool_start', { name: call.name, args: call.args, agent: this.name });

                        // Notify User
                        this.speak(recipient, `🛠️ Executing: ${call.name}`, 'status', { taskId: originalMsg.meta?.taskId });

                        const result = await this.executeTool(call);

                        // Event: Tool End
                        this.emit('tool_end', { name: call.name, result: result, agent: this.name });

                        this.context.push({
                            role: 'user',
                            toolResult: { name: call.name, content: result }
                        });
                    }

                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        continue;
                    }
                } else {
                    console.warn(`[${this.name}] Received empty or unknown response from LLM.`);
                    break;
                }
            }
        } catch (e) {
            console.error(`[${this.name}] ❌ Error in runLoop: ${e.message}`);
            this.speak(recipient, `I encountered a cognitive error: ${e.message}`, 'error');
        } finally {
            this.isThinking = false;
        }
    }

    checkInterrupt() {
        if (this.interruptSignal) {
            console.log(`[${this.name}] 🛑 Execution INTERRUPTED (Signal: ${this.interruptSignal}).`);
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
        console.log(`[${this.name}] 🛠️ Executing Tool: ${name}`, args);

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

    readFile({ path: filePath }) {
        try {
            if (!fs.existsSync(filePath)) return `Error: File not found at ${filePath}`;
            return fs.readFileSync(filePath, 'utf8');
        } catch (e) {
            return `Error reading file: ${e.message}`;
        }
    }

    async compactContext() {
        // Approximate token count (1 token ~= 4 chars)
        const totalChars = JSON.stringify(this.context).length;
        const estimatedTokens = totalChars / 4;
        const threshold = 200000; // Trigger compaction at 200k tokens

        if (estimatedTokens < threshold) return;

        console.log(`[${this.name}] 🧹 Compacting context (Size: ${Math.round(estimatedTokens)} tokens)...`);
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
                'cheap' // Use cheap model for summarization
            );

            const summaryMsg = {
                role: 'system',
                content: `[MEMORY SUMMARY]: ${typeof summary === 'string' ? summary : JSON.stringify(summary)}`
            };

            this.context = [summaryMsg, ...toKeep];
            console.log(`[${this.name}] ✅ Context compacted. New length: ${this.context.length}`);
            this.emit('context_compact_end', { newSize: JSON.stringify(this.context).length / 4 });

            // Log this event
            this.sessionLogger.log({ type: 'compaction', summary: summaryMsg.content });

        } catch (e) {
            console.error(`[${this.name}] ❌ Compaction failed: ${e.message}`);
        }
    }

    writeFile({ path: filePath, content }) {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
            return `Successfully wrote to ${filePath}`;
        } catch (e) {
            return `Error writing file: ${e.message}`;
        }
    }
}

module.exports = CoreAgent;
