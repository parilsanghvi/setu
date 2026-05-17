const { estimateJsonLength } = require('../lib/utils');
const assert = require('assert');

async function runTest() {
    console.log("🧪 Testing estimateJsonLength...");

    // 1. Primitive tests
    assert.strictEqual(estimateJsonLength(null), 4, "null should be 4");
    assert.strictEqual(estimateJsonLength(undefined), 0, "undefined should be 0");
    assert.strictEqual(estimateJsonLength("test"), 6, "string should be length + 2");
    assert.strictEqual(estimateJsonLength(""), 2, "empty string should be 2");
    assert.strictEqual(estimateJsonLength(123), 3, "number should be its string length");
    assert.strictEqual(estimateJsonLength(0), 1, "0 should be 1");
    assert.strictEqual(estimateJsonLength(-12.5), 5, "-12.5 should be 5");
    assert.strictEqual(estimateJsonLength(true), 4, "true should be 4");
    assert.strictEqual(estimateJsonLength(false), 5, "false should be 5");

    // 2. Arrays
    assert.strictEqual(estimateJsonLength([]), 2, "empty array should be 2");
    assert.strictEqual(estimateJsonLength([1]), 3, "[1] should be 3");
    assert.strictEqual(estimateJsonLength([1, 2, 3]), 7, "[1,2,3] should be 7");
    assert.strictEqual(estimateJsonLength(["a", "b"]), 9, '["a","b"] should be 9');
    assert.strictEqual(estimateJsonLength([undefined]), 6, '[undefined] should be 6 (null is 4 + brackets)');
    assert.strictEqual(estimateJsonLength([1, undefined, 3]), 10, '[1,null,3] should be 10');

    // 3. Objects
    assert.strictEqual(estimateJsonLength({}), 2, "empty object should be 2");
    assert.strictEqual(estimateJsonLength({a: 1}), 7, '{"a":1} should be 7');
    assert.strictEqual(estimateJsonLength({a: 1, b: 2}), 13, '{"a":1,"b":2} should be 13');

    const objWithUndefined = { a: 1, b: undefined };
    assert.strictEqual(estimateJsonLength(objWithUndefined), 7, '{"a":1} should be 7, skipping undefined');

    const objWithFunc = { a: 1, b: function() {} };
    assert.strictEqual(estimateJsonLength(objWithFunc), 7, '{"a":1} should be 7, skipping function');

    const objWithSymbol = { a: 1, b: Symbol('test') };
    assert.strictEqual(estimateJsonLength(objWithSymbol), 7, '{"a":1} should be 7, skipping symbol');

    // 4. Nested structures
    const nested = { a: [1, { b: "test" }], c: null };
    assert.strictEqual(estimateJsonLength(nested), JSON.stringify(nested).length, "nested object should match JSON.stringify length");

    // 5. Large object consistency check
    const largeObj = {
        users: Array(10).fill({ name: "User", age: 30, active: true }),
        metadata: { page: 1, count: 10, next: null },
        tags: ["api", "v1", "test"]
    };
    assert.strictEqual(estimateJsonLength(largeObj), JSON.stringify(largeObj).length, "large object should match JSON.stringify length");

    console.log("✅ estimateJsonLength Tests Passed");
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
