const assert = require('assert');
const LLM = require('../lib/LLM');

console.log('🧪 Testing lib/LLM.js...');

(async () => {
    try {
        // 1. Test Mock Response (No API Key)
        delete process.env.OPENAI_API_KEY; // Ensure no key
        // Force reset if constructor read it already? 
        // LLM is a singleton instance exported "new LLM()".
        // Use the instance.
        LLM.apiKey = null;

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

    } catch (e) {
        console.error('❌ lib/LLM.js Failed:', e);
        process.exit(1);
    }
})();
