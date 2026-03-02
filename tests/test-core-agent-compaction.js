const Module = require('module');
const path = require('path');

// 1. Mock Dependencies BEFORE requiring CoreAgent
const originalRequire = Module.prototype.require;

// Mock Bus
const mockBus = {
    heartbeat: (name, role, pid, status) => {},
    getUnread: () => [],
    markRead: () => {},
    send: (sender, recipient, content) => {},
};

// Mock LLM
const mockLLM = {
    generate: async (prompt, messages, type, tools) => {
        return "Mock Response";
    },
    registerProvider: () => {},
    getProvider: () => {},
};

// Mock SkillLoader
const mockSkillLoader = {
    load: () => new Map(),
};

// Mock Zod (minimal implementation)
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
    // Mock SkillLoader
    if (id.endsWith('/lib/SkillLoader') || id === './SkillLoader' || id.endsWith('/lib/SkillLoader.js')) {
        return mockSkillLoader;
    }
    // Mock Zod
    if (id === 'zod') {
        return {
            z: {
                object: () => ({ parse: () => {} }),
                string: () => ({ min: () => ({ max: () => {} }) }),
                ZodType: MockZodType
            }
        };
    }
    // Mock dotenv
    if (id === 'dotenv') {
        return { config: () => ({}) };
    }
    if (id === 'fs') {
        return { ...require('node:fs'), existsSync: () => false };
    }
    return originalRequire.apply(this, arguments);
};

// 2. Now require CoreAgent
const CoreAgent = require('../lib/CoreAgent');

// 3. Define TestAgent
class TestAgent extends CoreAgent {
    constructor() {
        super('TestBot', 'Tester', path.join(__dirname, 'temp_test_scope'));
        this.mockTokenCount = 0;
        this.mockLlmResponse = "Mock Summary";
        this.mockLlmError = null;
        this.llmCalls = [];
        this.loggedErrors = [];

        // Manually override logger
        this.logger = {
            info: () => {},
            error: (msg, err) => {
                this.loggedErrors.push({ msg, err });
            },
            warn: () => {},
            debug: () => {}
        };

        // Also override contextManager's estimateTokenCount since we delegated it
        this.contextManager.estimateTokenCount = () => {
            return this.mockTokenCount;
        }
    }

    // Mock sessionLogger
    get sessionLogger() {
        return {
            log: () => {}
        };
    }
    set sessionLogger(val) {} // setter required to override
}

// 4. Test Runner
async function runTest() {
    console.log("🧪 Testing CoreAgent.compactContext...");

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`✅ ${message}`);
            passed++;
        } else {
            console.error(`❌ ${message}`);
            failed++;
        }
    }

    // --- Setup ---
    const bot = new TestAgent();

    // Populate context with dummy messages
    // 20 messages. Indices 0-19.
    // If compacted:
    // cutOffIndex = 10.
    // toSummarize = 0-9.
    // toKeep = 10-19.
    const initialMessages = [];
    for (let i = 0; i < 20; i++) {
        initialMessages.push({ role: i % 2 === 0 ? 'user' : 'assistant', content: `Message ${i}` });
    }

    // --- Test 1: No Compaction (Tokens < Threshold) ---
    console.log("\n▶️  Test 1: No Compaction (Tokens < Threshold)");
    bot.context = [...initialMessages];
    bot.mockTokenCount = 100000; // Below 200k

    // Reset mocks
    mockLLM.generate = async () => {
        throw new Error("LLM should not be called");
    };

    try {
        await bot.compactContext();
        assert(bot.context.length === 20, "Context length should remain 20");
        assert(bot.context[0].content === "Message 0", "First message should remain 'Message 0'");
    } catch (e) {
        assert(false, `Unexpected error: ${e.message}`);
    }


    // --- Test 2: Compaction Triggered ---
    console.log("\n▶️  Test 2: Compaction Triggered");
    bot.context = [...initialMessages];
    bot.mockTokenCount = 250000; // Above 200k

    let llmCalled = false;
    let receivedPrompt = null;
    mockLLM.generate = async (sys, msgs, type) => {
        llmCalled = true;
        receivedPrompt = msgs;
        return "MOCK_SUMMARY_RESULT";
    };

    try {
        await bot.compactContext();

        assert(llmCalled, "LLM.generate should be called");
        // Expect context length: 1 (summary) + 10 (kept) = 11
        assert(bot.context.length === 11, `Context length should be 11 (Got ${bot.context.length})`);

        const firstMsg = bot.context[0];
        assert(firstMsg.role === 'system', "First message role should be 'system'");
        assert(firstMsg.content.includes("MOCK_SUMMARY_RESULT"), "Summary content should include mock result");

        const secondMsg = bot.context[1];
        assert(secondMsg.content === "Message 10", "Second message should be 'Message 10' (start of kept messages)");

    } catch (e) {
        assert(false, `Unexpected error: ${e.message}`);
    }


    // --- Test 3: Compaction Error Handling ---
    console.log("\n▶️  Test 3: Compaction Error Handling");
    bot.context = [...initialMessages]; // Reset context
    bot.mockTokenCount = 250000; // Above 200k
    bot.loggedErrors = [];

    mockLLM.generate = async () => {
        throw new Error("Simulated LLM Failure");
    };

    try {
        await bot.compactContext();

        assert(bot.context.length === 20, "Context length should remain 20 on failure");
        assert(bot.loggedErrors.length > 0, "Error should be logged");
        assert(bot.loggedErrors[0].msg.includes("Compaction failed"), "Log message should mention failure");

    } catch (e) {
        assert(false, `Method should catch error internally, but threw: ${e.message}`);
    }

    // --- Test 4: LLM Error Without Message Property ---
    console.log("\n▶️  Test 4: Compaction Error Handling - LLM Throws Non-Error");
    bot.context = [...initialMessages]; // Reset context
    bot.mockTokenCount = 250000; // Above 200k
    bot.loggedErrors = [];

    mockLLM.generate = async () => {
        throw "String Error"; // Throws a string directly
    };

    try {
        await bot.compactContext();
        assert(bot.context.length === 20, "Context length should remain 20 on string error");
        assert(bot.loggedErrors.length > 0, "String error should be logged");
        assert(bot.loggedErrors[0].msg.includes("Compaction failed"), "Log message should mention failure even for string errors");
    } catch (e) {
        assert(false, `Method should catch string error internally, but threw: ${e.message || e}`);
    }

    // --- Test 5: LLM Returns Null/Empty ---
    console.log("\n▶️  Test 5: Compaction Edge Cases - LLM Returns Null/Empty");
    bot.context = [...initialMessages]; // Reset context
    bot.mockTokenCount = 250000; // Above 200k
    bot.loggedErrors = [];

    mockLLM.generate = async () => {
        return null;
    };

    try {
        await bot.compactContext();
        // Expect context length: 1 (summary) + 10 (kept) = 11
        assert(bot.context.length === 11, `Context length should be 11 even on null return (Got ${bot.context.length})`);
        const firstMsg = bot.context[0];
        assert(firstMsg.role === 'system', "First message role should be 'system'");
        assert(firstMsg.content === "[MEMORY SUMMARY]: null", "Null summary should be stringified");
    } catch (e) {
        assert(false, `Method should not throw on null summary, but threw: ${e.message}`);
    }

    // --- Final Summary ---
    console.log("\n--- Test Summary ---");
    if (failed === 0) {
        console.log(`✅ All ${passed} checks passed.`);
        process.exit(0);
    } else {
        console.error(`❌ ${failed} checks failed.`);
        process.exit(1);
    }
}

runTest();
