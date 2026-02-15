const LLM = require('../lib/LLM');

(async () => {
    console.log('🧪 Testing Google LLM Connection...');
    try {
        const response = await LLM.generate('System', 'Hello, are you online?', 'expensive');
        console.log(`✅ Response received: "${response}"`);
        process.exit(0);
    } catch (e) {
        console.error('❌ Connection Failed:', e);
        process.exit(1);
    }
})();
