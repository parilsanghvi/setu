const assert = require('assert');
const Module = require('module');

// Mock require to avoid loading better-sqlite3 via lib/db.js
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path) {
    if (path === 'better-sqlite3' || path.includes('/db')) {
        return function () {
            return {
                prepare: () => ({ run: () => { }, get: () => { } }),
                transaction: (fn) => fn(),
                pragma: () => { },
                exec: () => { },
                heartbeat: () => { },
                getDeadAgents: () => [],
                updateTask: () => { },
            };
        };
    }
    if (path === 'dotenv') {
        return { config: () => ({}) };
    }
    if (path === 'zod') {
        return {
            z: {
                object: () => ({ parse: () => { } }),
                string: () => ({}),
                ZodType: class { }
            }
        };
    }
    // Mock internal dependencies that might drag in more deps
    if (path.endsWith('/LLM')) {
        return {
            generate: async () => "Mock Response"
        };
    }
    if (path.endsWith('/SkillLoader')) {
        return {
            load: () => new Map()
        };
    }
    if (path.endsWith('/SessionLogger')) {
        return class {
            log() { }
        };
    }

    return originalRequire.apply(this, arguments);
};


const CoreAgent = require('../lib/CoreAgent');

class TestAgent extends CoreAgent {
    constructor() {
        super('TestBot', 'Tester', 'temp_scope');
    }
}

async function runTest() {
    console.log("🧪 Testing Token Estimation...");

    const agent = new TestAgent();

    // 1. Simple string content
    const msg1 = { role: 'user', content: 'Hello world' };
    agent.context = [msg1];
    const count1 = agent.estimateTokenCount();
    // 'user'.length (4) + 'Hello world'.length (11) = 15. / 4 = 3.75
    const expected1 = (msg1.role.length + msg1.content.length) / 4;
    console.log(`Test 1 (String): ${count1}`);
    assert.strictEqual(count1, expected1);

    // 2. Object content
    const objContent = { key: 'value', num: 123 };
    const msg2 = { role: 'assistant', content: objContent };
    agent.context = [msg2];
    const count2 = agent.estimateTokenCount();
    // 'assistant'.length (9)
    // JSON.stringify(objContent) -> '{"key":"value","num":123}' (length 23)
    // Total 32. / 4 = 8.
    const expected2 = (msg2.role.length + JSON.stringify(objContent).length) / 4;
    console.log(`Test 2 (Object): ${count2} (Expected: ${expected2})`);
    assert.strictEqual(count2, expected2);

    // 3. Tool Calls
    const toolCall = {
        name: 'test_tool',
        args: { param: 'param_value' }
    };
    const msg3 = {
        role: 'assistant',
        content: null,
        toolCalls: [toolCall]
    };
    agent.context = [msg3];
    const count3 = agent.estimateTokenCount();
    // 'assistant'.length (9)
    // tool name 'test_tool' (9)
    // args: JSON.stringify({param:'param_value'}) -> '{"param":"param_value"}' (length 23)
    // Total 9 + 9 + 23 = 41. / 4 = 10.25
    const expectedTool = (msg3.role.length + toolCall.name.length + JSON.stringify(toolCall.args).length) / 4;
    console.log(`Test 3 (Tool Call): ${count3} (Expected: ${expectedTool})`);
    assert.strictEqual(count3, expectedTool);

    // 4. Large Object
    const largeObj = { list: Array(100).fill('a') };
    const msg4 = { role: 'user', content: largeObj };
    agent.context = [msg4];
    const count4 = agent.estimateTokenCount();
    const expected4 = (msg4.role.length + JSON.stringify(largeObj).length) / 4;
    console.log(`Test 4 (Large Object): ${count4} (Expected: ${expected4})`);
    assert.strictEqual(count4, expected4);

    // 5. Undefined Handling (Object)
    const objWithUndefined = { a: 1, b: undefined };
    const msg5 = { role: 'user', content: objWithUndefined };
    agent.context = [msg5];
    const count5 = agent.estimateTokenCount();
    const expected5 = (msg5.role.length + JSON.stringify(objWithUndefined).length) / 4;
    console.log(`Test 5 (Object with undefined): ${count5} (Expected: ${expected5})`);
    assert.strictEqual(count5, expected5);

    // 6. Undefined Handling (Array)
    const arrWithUndefined = [1, undefined, 3];
    const msg6 = { role: 'user', content: arrWithUndefined };
    agent.context = [msg6];
    const count6 = agent.estimateTokenCount();
    const expected6 = (msg6.role.length + JSON.stringify(arrWithUndefined).length) / 4;
    console.log(`Test 6 (Array with undefined): ${count6} (Expected: ${expected6})`);
    assert.strictEqual(count6, expected6);

    console.log("✅ Token Estimation Tests Passed (Baseline)");
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
