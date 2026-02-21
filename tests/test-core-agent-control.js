const Module = require('module');
const path = require('path');
const fs = require('fs');

// Mock Dependencies
const originalRequire = Module.prototype.require;

const mockBus = {
    heartbeat: (name, role, pid, status) => {},
    getUnread: () => [],
    markRead: () => {},
    send: (sender, recipient, content) => {},
};

const mockLLM = {
    generate: async () => "Mock Response",
    registerProvider: () => {},
    getProvider: () => {},
};

const mockSkillLoader = {
    load: () => new Map(),
    get: () => null,
    getAll: () => []
};

class MockZodType {}

Module.prototype.require = function (id) {
    if (id.endsWith('/lib/db') || id === './db' || id.endsWith('/lib/db.js')) {
        return mockBus;
    }
    if (id.endsWith('/lib/LLM') || id === './LLM' || id.endsWith('/lib/LLM.js')) {
        return mockLLM;
    }
    if (id.endsWith('/lib/SkillLoader') || id === './SkillLoader' || id.endsWith('/lib/SkillLoader.js')) {
        return mockSkillLoader;
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

const CoreAgent = require('../lib/CoreAgent');

class TestAgent extends CoreAgent {
    constructor() {
        super('ControlTestBot', 'Tester', 'test_scope');
        this.runLoopCalled = false;
        this.lastRunLoopArgs = null;
        // Mock logger to avoid console spam
        this.logger = {
            info: () => {}, // Suppress info
            warn: console.warn,
            error: console.error
        };
        // Mock sessionLogger to avoid dependency
        this.sessionLogger = {
            log: () => {}
        };
    }

    // Override runLoop to verify calls without executing logic
    async runLoop(recipient, msg) {
        this.runLoopCalled = true;
        this.lastRunLoopArgs = { recipient, msg };
        // Simulate setting busy state as original runLoop does
        this.isThinking = true;
    }

    // Helper to reset state between tests
    resetTestState() {
        this.runLoopCalled = false;
        this.lastRunLoopArgs = null;
        this.interruptSignal = null;
        this.isThinking = false;
        this.context = [];
    }
}

async function runTest() {
    console.log("🧪 Testing CoreAgent Control Signals...");
    const bot = new TestAgent();

    // Test 1: STOP Signal
    console.log("▶️ Test 1: STOP Signal");
    bot.resetTestState();
    bot.handleControlSignal({ command: 'STOP' });

    if (bot.interruptSignal !== 'STOP') {
        console.error(`❌ Expected interruptSignal to be 'STOP', got '${bot.interruptSignal}'`);
        process.exit(1);
    }
    console.log("✅ STOP signal sets interrupt flag");

    // Test 2: REDIRECT Signal (Idle)
    console.log("▶️ Test 2: REDIRECT Signal (Idle)");
    bot.resetTestState();
    // Ensure agent is idle
    bot.isThinking = false;

    const redirectMsg = { command: 'REDIRECT', payload: 'Do something else' };
    bot.handleControlSignal(redirectMsg);

    if (bot.interruptSignal !== 'REDIRECT') {
        console.error(`❌ Expected interruptSignal to be 'REDIRECT', got '${bot.interruptSignal}'`);
        process.exit(1);
    }

    const contextUpdated = bot.context.some(m => m.content.includes('Priority Override') && m.content.includes('Do something else'));
    if (!contextUpdated) {
        console.error("❌ Context not updated with override message");
        console.error("Context:", bot.context);
        process.exit(1);
    }

    if (!bot.runLoopCalled) {
        console.error("❌ runLoop was not called for idle agent");
        process.exit(1);
    }

    if (bot.lastRunLoopArgs.msg.content !== redirectMsg.payload) {
        console.error(`❌ runLoop called with wrong payload. Expected '${redirectMsg.payload}', got '${bot.lastRunLoopArgs.msg.content}'`);
        process.exit(1);
    }
    console.log("✅ REDIRECT signal handles idle agent correctly");

    // Test 3: REDIRECT Signal (Busy)
    console.log("▶️ Test 3: REDIRECT Signal (Busy)");
    bot.resetTestState();
    bot.isThinking = true; // Simulate busy

    bot.handleControlSignal(redirectMsg);

    if (bot.interruptSignal !== 'REDIRECT') {
        console.error(`❌ Expected interruptSignal to be 'REDIRECT', got '${bot.interruptSignal}'`);
        process.exit(1);
    }

    // Check context update
    const contextUpdatedBusy = bot.context.some(m => m.content.includes('Priority Override'));
    if (!contextUpdatedBusy) {
        console.error("❌ Context not updated with override message (busy state)");
        process.exit(1);
    }

    if (bot.runLoopCalled) {
        console.error("❌ runLoop should NOT be called if already thinking");
        process.exit(1);
    }
    console.log("✅ REDIRECT signal handles busy agent correctly");

    console.log("✅ All Control Signal Tests Passed");
}

runTest();
