const CoreAgent = require('../lib/CoreAgent');
const path = require('path');
const fs = require('fs');

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

    echo({ msg }) {
        return `ECHO: ${msg}`;
    }
}

async function runTest() {
    console.log("🧪 Testing CoreAgent...");

    // Mock LLM to avoid API costs
    const originalLLM = require('../lib/LLM');
    originalLLM.generate = async (prompt, messages, type, tools) => {
        const lastMsg = messages[messages.length - 1];

        // Simulating Tool Call Response (Turn 2)
        if (lastMsg.toolResult) {
            return `I echoed: ${lastMsg.toolResult.content}`;
        }

        // Simulating Initial Tool Call (Turn 1)
        if (lastMsg.role === 'user' && lastMsg.content && lastMsg.content.includes('echo')) {
            return {
                toolCalls: [{ name: 'echo', args: { msg: 'Hello World' } }]
            };
        }

        return "I am ready.";
    };

    const bot = new TestAgent();

    // Mock Speak
    bot.speak = (recipient, content) => {
        console.log(`[BOT -> ${recipient}]: ${content}`);
    };

    console.log("▶️  Test 1: Standard Loop with Tool");
    await bot.processMessage({
        sender: 'User',
        content: 'Please echo "Hello World"',
        type: 'chat',
        meta: {}
    });

    console.log("✅ CoreAgent Test Complete");
}

runTest();
