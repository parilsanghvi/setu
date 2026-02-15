const LLM = require('../lib/LLM');
const Config = require('../lib/Config');

async function test() {
    console.log('--- Universal Model Test ---');
    console.log(`Expensive Provider: ${Config.expensiveModelProvider} (${Config.expensiveModelName})`);
    console.log(`Cheap Provider: ${Config.cheapModelProvider} (${Config.cheapModelName})`);

    try {
        console.log('\nTesting Expensive Model...');
        const res1 = await LLM.generate('You are a helpful assistant.', 'Say "Hello Expensive World!"');
        console.log(`✅ Response: ${res1}`);
    } catch (e) {
        console.error(`❌ Expensive Model Failed: ${e.message}`);
    }

    try {
        console.log('\nTesting Cheap Model...');
        const res2 = await LLM.generate('You are a helpful assistant.', 'Say "Hello Cheap World!"', 'cheap');
        console.log(`✅ Response: ${res2}`);
    } catch (e) {
        console.error(`❌ Cheap Model Failed: ${e.message}`);
    }
}

test().catch(console.error);
