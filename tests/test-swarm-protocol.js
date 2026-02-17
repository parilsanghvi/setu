const Protocol = require('../lib/SwarmProtocol');
const assert = require('assert');

console.log('🧪 Testing lib/SwarmProtocol.js (createMessage)...');

try {
    // 1. Standard Message
    const msg1 = Protocol.createMessage('TEST_TYPE', 'Test Content', { foo: 'bar' });
    assert.deepStrictEqual(msg1, { type: 'TEST_TYPE', content: 'Test Content', meta: { foo: 'bar' } }, 'Should create a standard message');

    // 2. Default Meta
    const msg2 = Protocol.createMessage('TEST_TYPE', 'Test Content');
    assert.deepStrictEqual(msg2, { type: 'TEST_TYPE', content: 'Test Content', meta: {} }, 'Should default meta to empty object');

    // 3. Null Inputs
    const msg3 = Protocol.createMessage(null, undefined, { foo: 'bar' });
    assert.deepStrictEqual(msg3, { type: null, content: undefined, meta: { foo: 'bar' } }, 'Should pass null inputs correctly');

    console.log('✅ lib/SwarmProtocol.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/SwarmProtocol.js Failed:', e);
    process.exit(1);
}
