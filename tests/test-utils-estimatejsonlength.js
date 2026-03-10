const assert = require('assert');
const { test } = require('node:test');
const { estimateJsonLength } = require('../lib/utils');

test('estimateJsonLength correctly estimates length for primitives', () => {
    assert.strictEqual(estimateJsonLength(null), 4);
    assert.strictEqual(estimateJsonLength(undefined), 0);
    assert.strictEqual(estimateJsonLength('test string'), 13);
    assert.strictEqual(estimateJsonLength(''), 2);
    assert.strictEqual(estimateJsonLength(12345), 5);
    assert.strictEqual(estimateJsonLength(123.45), 6);
    assert.strictEqual(estimateJsonLength(0), 1);
    assert.strictEqual(estimateJsonLength(true), 4);
    assert.strictEqual(estimateJsonLength(false), 5);
});

test('estimateJsonLength correctly estimates length for arrays', () => {
    assert.strictEqual(estimateJsonLength([]), 2);
    assert.strictEqual(estimateJsonLength([1, 2, 3]), 7);
    assert.strictEqual(estimateJsonLength(['a', 'b']), 9);

    // Arrays containing elements that stringify to "null"
    assert.strictEqual(estimateJsonLength([1, undefined, null, function(){}, Symbol('sym')]), 23);
});

test('estimateJsonLength correctly estimates length for objects', () => {
    assert.strictEqual(estimateJsonLength({}), 2);
    assert.strictEqual(estimateJsonLength({a: 1, b: "two"}), 17);

    // Objects with skipped keys (undefined, function, symbol)
    assert.strictEqual(estimateJsonLength({a: undefined, b: function(){}, c: Symbol('sym'), d: 1}), 7);

    // Nested structures
    assert.strictEqual(estimateJsonLength({a: [1, 2], b: {c: true}}), 26);
});

test('estimateJsonLength correctly matches JSON.stringify length', () => {
    const cases = [
        null,
        "test string",
        12345,
        true,
        false,
        [],
        [1, 2, 3],
        {},
        {a: 1, b: "two"},
        {a: [1, 2], b: {c: true}},
        {a: undefined, b: function(){}, c: Symbol('sym'), d: 1},
        [1, undefined, null, function(){}, Symbol('sym')]
    ];

    for (const c of cases) {
        assert.strictEqual(estimateJsonLength(c), JSON.stringify(c).length);
    }
});
