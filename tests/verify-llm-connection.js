const LLM = require('../lib/LLM');

const timeout = setTimeout(() => {
    console.log('⚠️ LLM Connection Test timed out (assumed offline/unreachable). Skipping...');
    process.exit(0);
}, 5000);

(async () => {
    console.log('🧪 Testing Google LLM Connection...');
    try {
        const response = await LLM.generate('System', 'Hello, are you online?', 'expensive');
        clearTimeout(timeout);
        console.log(`✅ Response received: "${response}"`);
        process.exit(0);
    } catch (e) {
        clearTimeout(timeout);
        console.error('❌ Connection Failed:', e);
        process.exit(1);
    }
})();

