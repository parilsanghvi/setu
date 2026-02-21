const assert = require('assert');
const JsonParser = require('../lib/utils/JsonParser');

console.log('--- Testing JsonParser Utility ---');

const cases = [
    {
        name: 'Valid Raw JSON',
        input: '{"key": "value"}',
        expected: { key: "value" }
    },
    {
        name: 'Markdown Block (json)',
        input: 'Here is JSON:\n```json\n{"key": "value"}\n```',
        expected: { key: "value" }
    },
    {
        name: 'Markdown Block (no lang)',
        input: '```\n{"key": "value"}\n```',
        expected: { key: "value" }
    },
    {
        name: 'Surrounded by Text',
        input: 'Sure, here is the JSON: {"key": "value"} hope it helps.',
        expected: { key: "value" }
    },
    {
        name: 'Complex Nested',
        input: '{"a": {"b": [1, 2, 3]}}',
        expected: { a: { b: [1, 2, 3] } }
    },
    {
        name: 'Invalid JSON',
        input: 'This is not JSON',
        expected: null
    },
    {
        name: 'Broken JSON in Markdown',
        input: '```json\n{key: value}\n```',
        expected: null
    },
    {
        name: 'Empty Input',
        input: '',
        expected: null
    },
    {
        name: 'Null Input',
        input: null,
        expected: null
    },
    {
        name: 'Multiline JSON in Text',
        input: 'Here is the object:\n{\n  "id": 123,\n  "data": "foo"\n}\nThanks.',
        expected: { id: 123, data: "foo" }
    },
    {
        name: 'Multiple Code Blocks (JS first, then JSON)',
        input: 'Here is some JS code:\n```javascript\nconst x = {a:1};\n```\nAnd here is JSON:\n```json\n{"valid": "json"}\n```',
        expected: { valid: "json" }
    }
];

let passed = 0;
let failed = 0;

for (const c of cases) {
    const result = JsonParser.parse(c.input);
    try {
        assert.deepStrictEqual(result, c.expected);
        console.log(`✅ ${c.name}: Passed`);
        passed++;
    } catch (e) {
        console.error(`❌ ${c.name}: Failed`);
        console.error(`   Expected: ${JSON.stringify(c.expected)}`);
        console.error(`   Got:      ${JSON.stringify(result)}`);
        failed++;
    }
}

console.log(`\nTests Completed: ${passed}/${cases.length} Passed`);
if (failed > 0) process.exit(1);
