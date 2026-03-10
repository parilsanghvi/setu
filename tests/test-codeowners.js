const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { parseCodeowners } = require('../lib/onboarding/codeowners');

test('parseCodeowners', async (t) => {
    await t.test('Should return empty array when file does not exist', (t) => {
        t.mock.method(fs, 'existsSync', () => false);
        const rules = parseCodeowners('NON_EXISTENT_FILE');
        assert.deepStrictEqual(rules, []);
    });

    await t.test('Should parse a valid CODEOWNERS file correctly', (t) => {
        t.mock.method(fs, 'existsSync', () => true);
        const mockContent = `
# This is a comment
* @global-owner
/build/ @build-team
docs/* @docs-team

# Inline comment ignored? No, standard codeowners does not support inline comments, but let's test trimming
   src/  @src-team   @other-team
`;
        t.mock.method(fs, 'readFileSync', () => mockContent);

        const rules = parseCodeowners('DUMMY_FILE');

        assert.strictEqual(rules.length, 4);

        assert.strictEqual(rules[0].pattern, '*');
        assert.deepStrictEqual(rules[0].owners, ['global-owner']);
        assert.strictEqual(rules[0].lineNumber, 3);

        assert.strictEqual(rules[1].pattern, '/build/');
        assert.deepStrictEqual(rules[1].owners, ['build-team']);

        assert.strictEqual(rules[2].pattern, 'docs/*');
        assert.deepStrictEqual(rules[2].owners, ['docs-team']);

        assert.strictEqual(rules[3].pattern, 'src/');
        assert.deepStrictEqual(rules[3].owners, ['src-team', 'other-team']);
    });

    await t.test('Should ignore rules without owners', (t) => {
        t.mock.method(fs, 'existsSync', () => true);
        const invalidContent = `
# Missing owners
pattern-without-owners
`;
        t.mock.method(fs, 'readFileSync', () => invalidContent);
        const invalidRules = parseCodeowners('DUMMY_FILE');
        assert.strictEqual(invalidRules.length, 0);
    });
});
