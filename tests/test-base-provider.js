const assert = require('assert');
const BaseProvider = require('../lib/llm/BaseProvider');

console.log('🧪 Testing lib/llm/BaseProvider.js...');

try {
    const provider = new BaseProvider({});

    // Test Case 1: VETO triggers
    const vetoPhrases = [
        'Evaluate this architectural spec',
        'Evaluate this UI/Frontend spec',
        'Evaluate this Database/Schema spec'
    ];

    vetoPhrases.forEach(phrase => {
        const response = provider.getMockResponse(phrase);
        assert.strictEqual(response, "VETO: This is a mock veto for testing purposes. API Key missing.", `Failed for phrase: ${phrase}`);
    });

    // Test Case 2: RISKY trigger
    const riskyPhrase = "Review this junior engineer's plan";
    const riskyResponse = provider.getMockResponse(riskyPhrase);
    assert.strictEqual(riskyResponse, "RISKY: This plan involves dropping tables. Escalating to human.", `Failed for phrase: ${riskyPhrase}`);

    // Test Case 3: Default JSON response
    const defaultPhrase = "Hello world";
    const defaultResponse = provider.getMockResponse(defaultPhrase);
    let parsed;
    try {
        parsed = JSON.parse(defaultResponse);
    } catch (e) {
        assert.fail('Default response should be valid JSON');
    }

    assert.strictEqual(parsed.slug, "mock-skill-generated");
    assert.strictEqual(parsed.description, "Mock skill response.");
    assert.strictEqual(parsed.content, "# Mock Skill\n\nThis is a generated skill.");

    console.log('✅ lib/llm/BaseProvider.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/llm/BaseProvider.js Failed:', e);
    process.exit(1);
}
