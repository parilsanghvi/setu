const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { parseCodeowners } = require('../lib/onboarding/codeowners');

const TEST_FILE = path.join(__dirname, 'TEST_CODEOWNERS');

async function runTest() {
    console.log('🧪 Testing CODEOWNERS parsing...');

    try {
        // 1. File does not exist
        const noExist = parseCodeowners('NON_EXISTENT_FILE');
        assert.deepStrictEqual(noExist, [], 'Should return empty array when file does not exist');
        console.log('✅ Handled non-existent file correctly');

        // 2. Valid file with various cases
        const content = `
# This is a comment
* @global-owner
/build/ @build-team
docs/* @docs-team

# Inline comment ignored? No, standard codeowners does not support inline comments, but let's test trimming
   src/  @src-team   @other-team
`;
        fs.writeFileSync(TEST_FILE, content);

        const rules = parseCodeowners(TEST_FILE);

        assert.strictEqual(rules.length, 4, 'Should parse 4 valid rules');

        assert.strictEqual(rules[0].pattern, '*', 'Rule 1 pattern mismatch');
        assert.deepStrictEqual(rules[0].owners, ['global-owner'], 'Rule 1 owners mismatch');
        assert.strictEqual(rules[0].lineNumber, 3, 'Rule 1 line number mismatch');

        assert.strictEqual(rules[1].pattern, '/build/', 'Rule 2 pattern mismatch');
        assert.deepStrictEqual(rules[1].owners, ['build-team'], 'Rule 2 owners mismatch');

        assert.strictEqual(rules[2].pattern, 'docs/*', 'Rule 3 pattern mismatch');
        assert.deepStrictEqual(rules[2].owners, ['docs-team'], 'Rule 3 owners mismatch');

        assert.strictEqual(rules[3].pattern, 'src/', 'Rule 4 pattern mismatch');
        assert.deepStrictEqual(rules[3].owners, ['src-team', 'other-team'], 'Rule 4 owners mismatch');

        console.log('✅ Parsed valid CODEOWNERS file correctly');

        // 3. File with invalid lines (no owners)
        const invalidContent = `
# Missing owners
pattern-without-owners
`;
        fs.writeFileSync(TEST_FILE, invalidContent);
        const invalidRules = parseCodeowners(TEST_FILE);
        assert.strictEqual(invalidRules.length, 0, 'Should ignore rules without owners');
        console.log('✅ Handled rules without owners correctly');

    } finally {
        if (fs.existsSync(TEST_FILE)) {
            fs.unlinkSync(TEST_FILE);
        }
    }
}

runTest().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
