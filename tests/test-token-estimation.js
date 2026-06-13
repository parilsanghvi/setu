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

    const expectedTool = (msg3.role.length + 4 + toolCall.name.length + JSON.stringify(toolCall.args).length) / 4;
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

    // 7. Null value
    const msg7 = { role: 'user', content: null };
    agent.context = [msg7];
    const count7 = agent.estimateTokenCount();
    const expected7 = (msg7.role.length + 4) / 4; // 'null' is 4 chars
    console.log(`Test 7 (Null): ${count7} (Expected: ${expected7})`);
    assert.strictEqual(count7, expected7);

    // 8. Number value
    const msg8 = { role: 'user', content: 12345 };
    agent.context = [msg8];
    const count8 = agent.estimateTokenCount();
    const expected8 = (msg8.role.length + 5) / 4; // '12345' is 5 chars
    console.log(`Test 8 (Number): ${count8} (Expected: ${expected8})`);
    assert.strictEqual(count8, expected8);

    // 9. Boolean value (true and false)
    const msg9 = { role: 'user', content: true };
    agent.context = [msg9];
    const count9 = agent.estimateTokenCount();
    const expected9 = (msg9.role.length + 4) / 4; // 'true' is 4 chars
    console.log(`Test 9 (Boolean true): ${count9} (Expected: ${expected9})`);
    assert.strictEqual(count9, expected9);

    const msg9b = { role: 'user', content: false };
    agent.context = [msg9b];
    const count9b = agent.estimateTokenCount();
    const expected9b = (msg9b.role.length + 5) / 4; // 'false' is 5 chars
    console.log(`Test 9b (Boolean false): ${count9b} (Expected: ${expected9b})`);
    assert.strictEqual(count9b, expected9b);

    // 10. Empty Array
    const msg10 = { role: 'user', content: [] };
    agent.context = [msg10];
    const count10 = agent.estimateTokenCount();
    const expected10 = (msg10.role.length + 2) / 4; // '[]' is 2 chars
    console.log(`Test 10 (Empty Array): ${count10} (Expected: ${expected10})`);
    assert.strictEqual(count10, expected10);

    // 11. Empty Object
    const msg11 = { role: 'user', content: {} };
    agent.context = [msg11];
    const count11 = agent.estimateTokenCount();
    const expected11 = (msg11.role.length + 2) / 4; // '{}' is 2 chars
    console.log(`Test 11 (Empty Object): ${count11} (Expected: ${expected11})`);
    assert.strictEqual(count11, expected11);

    // 12. Nested structures
    const nestedObj = { a: [1, 2], b: { c: true } };
    const msg12 = { role: 'user', content: nestedObj };
    agent.context = [msg12];
    const count12 = agent.estimateTokenCount();
    const expected12 = (msg12.role.length + JSON.stringify(nestedObj).length) / 4;
    console.log(`Test 12 (Nested structures): ${count12} (Expected: ${expected12})`);
    assert.strictEqual(count12, expected12);

    // 13. Object with skipped keys (function, symbol)
    const sym = Symbol('sym');
    const func = function() {};
    const objWithSkipped = { a: 1, b: func, c: sym };
    const msg13 = { role: 'user', content: objWithSkipped };
    agent.context = [msg13];
    const count13 = agent.estimateTokenCount();
    const expected13 = (msg13.role.length + JSON.stringify(objWithSkipped).length) / 4;
    console.log(`Test 13 (Skipped keys): ${count13} (Expected: ${expected13})`);
    assert.strictEqual(count13, expected13);

    // 14. Fallback for unstringifiable objects
    const unstringifiableObj = 10n; // BigInt bypasses `typeof === 'object'` in the code, falling down to the fallback try-catch.
    const msg14 = { role: 'user', content: unstringifiableObj };
    agent.context = [msg14];
    const count14 = agent.estimateTokenCount();
    // 'user'.length (4) + 50 (fallback arbitrary penalty) = 54. / 4 = 13.5
    const expected14 = (msg14.role.length + 50) / 4;
    console.log(`Test 14 (Fallback for tricky objects): ${count14} (Expected: ${expected14})`);
    assert.strictEqual(count14, expected14);

    console.log("✅ Token Estimation Tests Passed (Baseline and Edge Cases)");
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
