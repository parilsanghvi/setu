const Drona = require('../agents/Drona');
const drona = new Drona('Drona-Test', 'Drona');

const mockResponses = [
    // 1. Raw JSON
    '{"slug": "test-1", "description": "test desc", "content": "# Test 1"}',
    // 2. Markdown block
    'Here is the skill:\n```json\n{"slug": "test-2", "description": "test desc", "content": "# Test 2"}\n```\nHope this helps!',
    // 3. Noisy text with braces
    'I have analyzed the task. The crystallized knowledge is: {"slug": "test-3", "description": "test desc", "content": "# Test 3"} in JSON format.'
];

console.log('Testing Drona.parseResponse robustness...');

mockResponses.forEach((resp, i) => {
    const result = drona.parseResponse(resp);
    if (result && result.slug === `test-${i + 1}`) {
        console.log(`✅ Case ${i + 1} passed: ${result.slug}`);
    } else {
        console.error(`❌ Case ${i + 1} failed! Response:`, resp);
    }
});
