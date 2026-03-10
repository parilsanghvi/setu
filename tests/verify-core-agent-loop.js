const Module = require('module');
const path = require('path');
const fs = require('fs');

// 1. Mock Dependencies BEFORE requiring CoreAgent
const originalRequire = Module.prototype.require;
const mockBus = {
    heartbeat: (name, role, pid, status) => {
        // console.log(`[MockDB] Heartbeat: ${name} -> ${status}`);
    },
    getUnread: () => [],
    markRead: () => {},
    send: (sender, recipient, content) => {
        // console.log(`[MockDB] Send: ${sender} -> ${recipient}: ${content}`);
    },
};

const mockLLM = {
    generate: async (prompt, messages, type, tools) => {
        // Default implementation, will be overridden in test
        return "Mock Response";
    },
    registerProvider: () => {},
    getProvider: () => {},
};

const mockSkillLoader = {
    load: () => new Map()
};

const mockConfig = {
    contextCompactionThreshold: 200000
};

class MockZodType {}

Module.prototype.require = function (id) {
    if (id.endsWith('/lib/db') || id === './db' || id.endsWith('/lib/db.js')) {
        return mockBus;
    }
    if (id.endsWith('/lib/LLM') || id === './LLM' || id.endsWith('/lib/LLM.js')) {
        return mockLLM;
    }
    if (id.endsWith('/lib/SkillLoader') || id === './SkillLoader') {
        return mockSkillLoader;
    }
    // Also mock Config because CoreAgent might need it? No, CoreAgent uses modelConfig arg.
    // But let's check if it requires Config.
    if (id.endsWith('/lib/Config') || id === './Config') {
         return mockConfig;
    }

    if (id === 'zod') {
        return {
            z: {
                object: () => ({ parse: () => {} }),
                string: () => ({ min: () => ({ max: () => {} }) }),
                ZodType: MockZodType
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

// 2. Now require CoreAgent
const CoreAgent = require('../lib/CoreAgent');

// 3. Define TestAgent
class TestAgent extends CoreAgent {
    constructor() {
        super('TestBot', 'Tester', path.join(__dirname, 'temp_test_scope'));
        this.setTools([
            {
                name: "echo",
                description: "Echo back input",
                parameters: { type: "object", properties: { msg: { type: "string" } }, required: ["msg"] }
            }
        ]);
        this.systemPrompt = "You are a test bot.";
    }

    async executeTool(toolCall) {
        if (toolCall.name === 'echo') {
             return `ECHO: ${toolCall.args.msg}`;
        }
        return super.executeTool(toolCall);
    }
}

// 4. Test Runner
async function runTest() {
    console.log("🧪 Testing CoreAgent RunLoop Logic...");

    const bot = new TestAgent();
    // Mock SessionLogger to avoid file creation
    bot.sessionLogger = {
        log: (entry) => {}
    };

    // Helper to capture output
    let lastMessage = null;
    let speakCount = 0;
    bot.speak = (recipient, content, type, meta) => {
        if (type === 'thought_start' || type === 'thought_end') return;
        // console.log(`[BOT -> ${recipient}]: ${content}`);
        lastMessage = content;
        speakCount++;
    };

    // --- Test 1: Standard Turn ---
    console.log("▶️  Test 1: Standard Turn");
    lastMessage = null;
    mockLLM.generate = async () => "Simple response.";

    await bot.processMessage({
        sender: 'User',
        content: 'Hi',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === "Simple response.") {
        console.log("✅ Test 1 Passed");
    } else {
        console.error(`❌ Test 1 Failed. Got: ${lastMessage}`);
        process.exit(1);
    }

    // --- Test 2: Tool Execution (Multi-turn) ---
    console.log("▶️  Test 2: Tool Execution");
    lastMessage = null;
    mockLLM.generate = async (prompt, messages) => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.toolResult) {
            return `I echoed: ${lastMsg.toolResult.content}`;
        }
        if (lastMsg.role === 'user' && lastMsg.content && lastMsg.content.includes('echo')) {
            return {
                toolCalls: [{ name: 'echo', args: { msg: 'Hello' } }]
            };
        }
        return "Thinking...";
    };

    await bot.processMessage({
        sender: 'User',
        content: 'Please echo "Hello"',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === "I echoed: ECHO: Hello") {
        console.log("✅ Test 2 Passed");
    } else {
        console.error(`❌ Test 2 Failed. Got: ${lastMessage}`);
        process.exit(1);
    }

    // --- Test 3: Interrupt (STOP) ---
    console.log("▶️  Test 3: Interrupt (STOP)");
    lastMessage = null;
    speakCount = 0;

    mockLLM.generate = async () => {
        // Simulate STOP signal arriving during thinking
        bot.handleControlSignal({ command: 'STOP' });
        return "This should not be sent fully.";
    };

    // Reset context
    bot.context = [];

    await bot.processMessage({
        sender: 'User',
        content: 'Stop me!',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === null && speakCount === 0) {
        console.log("✅ Test 3 Passed (Execution stopped before output)");
    } else {
        console.error(`❌ Test 3 Failed. Message sent: ${lastMessage}`);
        process.exit(1);
    }

    // --- Test 4: Interrupt (REDIRECT) ---
    console.log("▶️  Test 4: Interrupt (REDIRECT)");
    lastMessage = null;
    speakCount = 0;

    let llmCallCount = 0;
    mockLLM.generate = async (prompt, messages) => {
        llmCallCount++;

        // First call: User says "Do task". We set REDIRECT.
        if (llmCallCount === 1) {
            // Simulate REDIRECT signal
            bot.handleControlSignal({ command: 'REDIRECT', payload: "New Task" });
            return "Old Task Response"; // Should be ignored
        }

        // Second call: Should see "New Task" in context?
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.content.includes("New Task")) {
             return "Handling New Task";
        }

        return "Confused";
    };

    bot.context = [];
    llmCallCount = 0; // Reset counter

    await bot.processMessage({
        sender: 'User',
        content: 'Do task',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === "Handling New Task") {
        console.log("✅ Test 4 Passed");
    } else {
        console.error(`❌ Test 4 Failed. Got: ${lastMessage}`);
        process.exit(1);
    }

    console.log("✅ All Refactor Tests Complete");
}

runTest();
