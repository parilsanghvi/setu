const Agent = require('./Agent');
const LLM = require('./LLM');
const fs = require('fs');

/**
 * CoreAgent - The "Brain" Upgrade
 * Extends the base Agent with a standardized Thinking/Tool Loop.
 */
class CoreAgent extends Agent {
    constructor(name, role, scope) {
        super(name, role, scope);
        this.tools = []; // List of tool definitions
        this.context = []; // Short-term memory (chat history)
        this.systemPrompt = "You are an AI agent.";
        this.interruptSignal = null; // Steering flag
        this.isThinking = false; // Track active state

        // LLM Options (Thinking, etc.)
        this.llmOptions = {
            thinking: { type: 'enabled', budget_tokens: 2048 },
            reasoning_effort: 'medium',
            maxTokens: 20000
        };

        // Listen for Steering Commands
        process.on('message', (msg) => {
            if (msg.type === 'control') {
                this.handleControlSignal(msg);
            }
        });
    }

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
        console.log(`[${this.name}] 🧠 CoreAgent Processing: ${msg.content.substring(0, 50)}...`);

        // Reset interrupt on new message
        this.interruptSignal = null;

        // Add user message to context
        this.context.push({ role: 'user', content: msg.content });

        // Run the Thinking Loop
        await this.runLoop(msg.sender, msg);
    }

    /**
     * The Main Cycle: Input -> Think -> Tool -> Output
     */
    async runLoop(recipient, originalMsg) {
        if (this.isThinking) {
            // Already thinking?
            // Maybe just update context?
            // For now, let's allow concurrent loops or locking?
            // CoreAgent is single-threaded async. 
            // If we call runLoop while in runLoop (via await), it's fine.
            // But we shouldn't have parallel loops.
            // We'll rely on interruptSignal to break the old one.
        }

        this.isThinking = true;
        let turns = 0;
        const maxTurns = 10; // Prevent infinite loops

        try {
            while (turns < maxTurns) {
                // 0. Check Interrupt (Pre-Turn)
                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return;
                    if (this.interruptSignal === 'REDIRECT') {
                        // Consume and Continue
                        console.log(`[${this.name}] 🔄 Resuming loop for Redirect...`);
                        this.interruptSignal = null;
                        // Don't increment turns? Or do we?
                        // Let's increment to prevent infinite loops even in redirects
                    }
                }

                turns++;

                // 1. Generate Response
                // We use the full context array
                // Map context to LLM format if needed (LLM.js expects specific format)
                const llmMessages = this.context.map(m => {
                    // Normalize for LLM provider
                    if (m.toolCalls) return { role: 'assistant', toolCalls: m.toolCalls };
                    if (m.toolResult) return { role: 'user', toolResult: m.toolResult };
                    return { role: m.role, content: m.content };
                });

                console.log(`[${this.name}] Calling LLM (Turn ${turns})...`);

                // Check Interrupt before expensive call
                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return;
                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        continue; // Skip LLM call, restart loop with new context
                    }
                }

                const response = await LLM.generate(
                    this.systemPrompt,
                    llmMessages,
                    'expensive', // Default to expensive for smart agents
                    this.tools,
                    this.llmOptions
                );

                // Check Interrupt after call (before acting)
                if (this.checkInterrupt()) {
                    if (this.interruptSignal === 'STOP') return;
                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        // Discard response? Or process it?
                        // If redirected, we likely want to ignore the old thought.
                        console.log(`[${this.name}] 🗑️ Discarding old thought due to Redirect.`);
                        continue; // Restart loop
                    }
                }

                // 2. Handle Text Response
                if (typeof response === 'string') {
                    // Final answer received
                    this.context.push({ role: 'assistant', content: response });
                    this.speak(recipient, response, 'chat', { taskId: originalMsg.meta?.taskId });
                    return; // Loop ends
                }

                // 3. Handle Tool Calls
                if (response && response.toolCalls) {
                    this.context.push({ role: 'assistant', toolCalls: response.toolCalls });

                    // Execute Tools
                    for (const call of response.toolCalls) {
                        if (this.checkInterrupt()) {
                            if (this.interruptSignal === 'STOP') return;
                            if (this.interruptSignal === 'REDIRECT') break; // Break tool loop to restart main loop
                        }

                        const result = await this.executeTool(call);

                        // Notify User/logs about tool usage (optional but good for UX)
                        this.speak(recipient, `🛠️ Executing: ${call.name}`, 'status', { taskId: originalMsg.meta?.taskId });

                        // Add result to context
                        // Note: Our providers expect toolResult matching the call
                        this.context.push({
                            role: 'user',
                            toolResult: { name: call.name, content: result }
                        });
                    }

                    // If we broke out of tool loop due to redirect, continue main loop
                    if (this.interruptSignal === 'REDIRECT') {
                        this.interruptSignal = null;
                        console.log(`[${this.name}] 🔄 Resuming loop after tool interrupt...`);
                        continue;
                    }
                } else {
                    // Weird state or empty response?
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

        // check if method exists on this instance
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
