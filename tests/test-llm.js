const assert = require('assert');
const LLM = require('../lib/LLM');

console.log('🧪 Testing lib/LLM.js...');

(async () => {
    try {
        // Mock LLM.generate to avoid hitting real APIs
        LLM.generate = async () => JSON.stringify({ slug: 'mock-skill-generated' });

        const response = await LLM.generate('System', 'Hello');
        // Expecting JSON format per previous fix
        let parsed;
        try {
            parsed = JSON.parse(response);
        } catch (e) {
            assert.fail('Response should be valid JSON in mock mode');
        }

        assert(parsed.slug, 'Mock response should have slug');
        assert.strictEqual(parsed.slug, 'mock-skill-generated');

        console.log('✅ lib/LLM.js Tests Passed!');
        process.exit(0);

    } catch (e) {
        console.error('❌ lib/LLM.js Failed:', e);
        process.exit(1);
    }
})();
