const Module = require('module');
const originalRequire = Module.prototype.require;

// Mock dotenv before any other imports
Module.prototype.require = function(id) {
    if (id === 'dotenv') {
        return {
            config: () => ({ parsed: {}, error: null })
        };
    }
    return originalRequire.apply(this, arguments);
};

const assert = require('assert');
// Now import LLM which imports Config which imports dotenv
const LLM = require('../lib/LLM');

// Mock Providers
const mockExpensive429 = {
    generate: async () => {
        throw new Error('429 Too Many Requests');
    }
};

const mockExpensiveGeneric = {
    generate: async () => {
        throw new Error('Generic Error');
    }
};

const mockCheapSuccess = {
    generate: async () => {
        return 'Fallback Response';
    }
};

const mockCheap429 = {
    generate: async () => {
        throw new Error('429 Rate Limit Exceeded');
    }
};

(async () => {
    console.log('🧪 Testing LLM Rate Limit Fallback...');

    try {
        // --- Test 1: Successful Fallback ---
        console.log('Test 1: Fallback from expensive to cheap');

        // Reset state
        LLM._activeCalls = 0;
        LLM._cooldownUntil = null;
        LLM.providers.set('expensive', mockExpensive429);
        LLM.providers.set('cheap', mockCheapSuccess);

        const response1 = await LLM.generate('System', 'User', 'expensive');

        assert.strictEqual(response1, 'Fallback Response', 'Should return response from fallback provider');
        console.log('✅ Test 1 Passed');


        // --- Test 2: Double Rate Limit (Cooldown) ---
        console.log('Test 2: Both providers fail (cooldown)');

        // Reset state
        LLM._activeCalls = 0;
        LLM._cooldownUntil = null;
        LLM.providers.set('expensive', mockExpensive429);
        LLM.providers.set('cheap', mockCheap429);

        const response2 = await LLM.generate('System', 'User', 'expensive');

        assert.ok(response2.includes('System: All AI models are temporarily rate-limited'), 'Should return system message about rate limit');
        assert.ok(LLM._cooldownUntil > Date.now(), 'Should set cooldown in the future');
        console.log('✅ Test 2 Passed');


        // --- Test 3: Non-Rate Limit Error (No Fallback) ---
        console.log('Test 3: Non-Rate Limit Error (No Fallback)');

        // Reset state
        LLM._activeCalls = 0;
        LLM._cooldownUntil = null;
        LLM.providers.set('expensive', mockExpensiveGeneric);
        LLM.providers.set('cheap', mockCheapSuccess); // Should NOT be called

        try {
            await LLM.generate('System', 'User', 'expensive');
            assert.fail('Should have thrown an error');
        } catch (e) {
            assert.strictEqual(e.message, 'Generic Error');
        }
        console.log('✅ Test 3 Passed');


        // --- Test 4: Cooldown Active (Wait) ---
        console.log('Test 4: Cooldown Active (Wait 1s)');

        // Reset state
        LLM._activeCalls = 0;
        LLM._cooldownUntil = Date.now() + 1000; // 1 second cooldown
        LLM.providers.set('expensive', mockCheapSuccess); // Use success provider as expensive to verify it runs after wait

        const start = Date.now();
        const response4 = await LLM.generate('System', 'User', 'expensive');
        const duration = Date.now() - start;

        // Allow some flexibility for OS scheduling (950ms instead of strict 1000ms)
        assert.ok(duration >= 950, `Should wait for cooldown (took ${duration}ms)`);
        assert.strictEqual(response4, 'Fallback Response');
        assert.strictEqual(LLM._cooldownUntil, null, 'Cooldown should be cleared after waiting');
        console.log('✅ Test 4 Passed');

        console.log('\n🎉 All LLM Rate Limit Tests Passed!');

    } catch (e) {
        console.error('\n❌ Test Failed:', e);
        process.exit(1);
    }
})();
