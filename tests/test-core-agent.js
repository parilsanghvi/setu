const Module = require('module');
const path = require('path');
const fs = require('fs');

// 1. Mock Dependencies BEFORE requiring CoreAgent
// This is necessary because the environment might lack native modules (like better-sqlite3)
// or configuration files (.env, etc.) required by the full dependency tree.
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

class MockZodType {}

Module.prototype.require = function (id) {
    // Mock DB
    if (id.endsWith('/lib/db') || id === './db' || id.endsWith('/lib/db.js')) {
        return mockBus;
    }
    // Mock LLM
    if (id.endsWith('/lib/LLM') || id === './LLM' || id.endsWith('/lib/LLM.js')) {
        return mockLLM;
    }
    // Mock Zod (minimal implementation)
    if (id === 'zod') {
        return {
            z: {
                object: () => ({ parse: () => {} }),
                string: () => ({ min: () => ({ max: () => {} }) }), // Add string for drishti-v2 if needed
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
        this.systemPrompt = "You are a test bot. If asked to echo, use the echo tool.";
    }

    // Override executeTool to avoid filesystem reads/writes if not needed
    async executeTool(toolCall) {
        if (toolCall.name === 'echo') {
             return `ECHO: ${toolCall.args.msg}`;
        }
        return super.executeTool(toolCall);
    }
}

// 4. Test Runner
async function runTest() {
    console.log("🧪 Testing CoreAgent...");

    const bot = new TestAgent();

    // Mock SessionLogger to avoid file creation
    bot.sessionLogger = {
        log: (entry) => {
            // console.log(`[MockLogger] ${JSON.stringify(entry)}`);
        }
    };

    // Mock Speak to capture output
    let lastMessage = null;
    bot.speak = (recipient, content, type, meta) => {
        console.log(`[BOT -> ${recipient}]: ${content}`);
        lastMessage = content;
    };

    // --- Test 1: Tool Call ---
    console.log("▶️  Test 1: Standard Loop with Tool");

    // Configure Mock LLM for this test
    mockLLM.generate = async (prompt, messages, type, tools) => {
        const lastMsg = messages[messages.length - 1];

        // Simulating Tool Call Response (Turn 2 - after tool execution)
        if (lastMsg.toolResult) {
            return `I echoed: ${lastMsg.toolResult.content}`;
        }

        // Simulating Initial Tool Call (Turn 1 - user request)
        if (lastMsg.role === 'user' && lastMsg.content && lastMsg.content.includes('echo')) {
            return {
                toolCalls: [{ name: 'echo', args: { msg: 'Hello World' } }]
            };
        }

        return "I am ready.";
    };

    await bot.processMessage({
        sender: 'User',
        content: 'Please echo "Hello World"',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === "I echoed: ECHO: Hello World") {
        console.log("✅ Test 1 Passed");
    } else {
        console.error(`❌ Test 1 Failed. Got: ${lastMessage}`);
        process.exit(1);
    }

    // --- Test 2: Text Response only ---
    console.log("▶️  Test 2: Text Response");
    lastMessage = null;
    mockLLM.generate = async () => "Just text response.";

    await bot.processMessage({
        sender: 'User',
        content: 'Just say something.',
        type: 'chat',
        meta: {}
    });

    if (lastMessage === "Just text response.") {
        console.log("✅ Test 2 Passed");
    } else {
        console.error(`❌ Test 2 Failed. Got: ${lastMessage}`);
        process.exit(1);
    }

    console.log("✅ All CoreAgent Tests Complete");
}

runTest();
