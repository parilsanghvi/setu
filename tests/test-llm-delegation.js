const assert = require('assert');
const path = require('path');
const Module = require('module');

// 0. Mock 'dotenv' because it might be missing in this environment
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'dotenv') {
        return {
            config: () => ({ error: null, parsed: {} })
        };
    }
    return originalRequire.apply(this, arguments);
};

// 1. Mock dependencies BEFORE requiring LLM
// We need to require the factory to patch it.
// Note: This will execute the factory module body.
// If factory requires other modules that need mocking, we might have issues.
// But we mocked dotenv, so it should be fine.
const ProviderFactory = require('../lib/models/factory');

// Mock behavior state
const mockBehavior = {
    expensive: {
        generate: async () => 'Expensive Response',
        delay: 0
    },
    cheap: {
        generate: async () => 'Cheap Response',
        delay: 0
    }
};

let callCounts = { expensive: 0, cheap: 0 };

// Patch ProviderFactory.create
ProviderFactory.create = (providerType, modelName, options) => {
    // Identify if this is intended to be 'expensive' or 'cheap' based on call order
    // initialization calls registerProvider twice: expensive, then cheap.
    // However, LLM might be re-initialized or called differently.
    // But since we are requiring LLM for the first time in this process, the constructor runs once.

    // To be more robust, let's guess based on modelName if possible, or fallback to sequence.
    // But modelName comes from Config, which comes from Env.
    // Let's rely on sequence for the initial default registration.

    // We can also check `options` or `providerType` if we knew what they were.
    // But since we control the test environment, we can assume standard behavior.

    // Let's use a closure variable to track if it's the first call.
    if (typeof ProviderFactory._callCount === 'undefined') {
        ProviderFactory._callCount = 0;
    }

    const count = ProviderFactory._callCount++;
    // 0 -> expensive, 1 -> cheap.
    // Subsequent calls (e.g. getProvider('openai')) might happen too.

    let id = 'unknown';
    if (count === 0) id = 'expensive';
    else if (count === 1) id = 'cheap';
    else {
        // For other calls, maybe use providerType as id if it matches?
        if (mockBehavior[providerType]) id = providerType;
    }

    return {
        id,
        generate: async (...args) => {
            // Determine behavior based on the id determined at creation time
            // Fallback to 'expensive' behavior if unknown/other
            const behaviorId = (id === 'expensive' || id === 'cheap') ? id : 'expensive';

            callCounts[behaviorId]++;
            const behavior = mockBehavior[behaviorId];

            if (behavior.delay > 0) {
                await new Promise(resolve => setTimeout(resolve, behavior.delay));
            }

            if (behavior.error) {
                throw new Error(behavior.error);
            }

            return behavior.generate(...args);
        }
    };
};


// 2. Require LLM
const LLM = require('../lib/LLM');

console.log('🧪 Testing lib/LLM.js Delegation & Concurrency...');

async function runTests() {
    try {
        // --- Test 1: Concurrency ---
        console.log('Test 1: Concurrency Control');
        LLM._maxConcurrent = 2;
        LLM._activeCalls = 0; // Reset
        LLM._queue = []; // Reset

        // Reset mocks
        mockBehavior.expensive = { generate: async () => 'Done', delay: 100 };
        mockBehavior.cheap = { generate: async () => 'Done', delay: 100 };
        callCounts.expensive = 0;

        const start = Date.now();
        // Use 'expensive' model explicitly
        const p1 = LLM.generate('sys', 'user', 'expensive');
        const p2 = LLM.generate('sys', 'user', 'expensive');
        const p3 = LLM.generate('sys', 'user', 'expensive');

        // At t=0, p1 and p2 should start (activeCalls=2). p3 should be queued.

        await new Promise(resolve => setTimeout(resolve, 20)); // wait a bit
        assert.strictEqual(LLM._activeCalls, 2, 'Should have 2 active calls');
        assert.strictEqual(LLM._queue.length, 1, 'Should have 1 queued call');

        await Promise.all([p1, p2, p3]);
        const duration = Date.now() - start;

        // With concurrency 2 and delay 100ms:
        // 2 run in parallel (100ms), then 1 runs (100ms). Total ~200ms.
        // If concurrency was 3: total ~100ms.
        // If concurrency was 1: total ~300ms.

        console.log(`Duration: ${duration}ms`);
        assert(duration > 150, `Concurrency failed, took ${duration}ms, expected > 150ms`);
        assert.strictEqual(callCounts.expensive, 3);
        console.log('✅ Concurrency verified');


        // --- Test 2: Provider Fallback (Expensive -> Cheap) ---
        console.log('Test 2: Provider Fallback');
        LLM._activeCalls = 0;
        LLM._queue = [];
        LLM._cooldownUntil = null;
        callCounts.expensive = 0;
        callCounts.cheap = 0;

        mockBehavior.expensive = { error: '429 Rate Limit', delay: 0 };
        mockBehavior.cheap = { generate: async () => 'Fallback Success', delay: 0 };

        const res2 = await LLM.generate('sys', 'user', 'expensive');
        assert.strictEqual(res2, 'Fallback Success');
        assert.strictEqual(callCounts.expensive, 1, 'Should attempt expensive');
        assert.strictEqual(callCounts.cheap, 1, 'Should attempt cheap');
        console.log('✅ Fallback verified');


        // --- Test 3: Full Rate Limit (Both -> Cooldown) ---
        console.log('Test 3: Full Rate Limit');
        mockBehavior.expensive = { error: '429 Rate Limit', delay: 0 };
        mockBehavior.cheap = { error: '429 Rate Limit', delay: 0 };
        LLM._cooldownUntil = null;

        const res3 = await LLM.generate('sys', 'user', 'expensive');
        assert(res3.includes('System: All AI models are temporarily rate-limited'), 'Should return system cooldown message');
        assert(LLM._cooldownUntil > Date.now(), 'Should set cooldown timer');
        console.log('✅ Full Rate Limit verified');


        // --- Test 4: Generic Error (No Fallback) ---
        console.log('Test 4: Generic Error');
        LLM._cooldownUntil = null; // Reset cooldown
        mockBehavior.expensive = { error: '500 Server Error', delay: 0 };
        mockBehavior.cheap = { generate: async () => 'Should Not Be Called' };

        try {
            await LLM.generate('sys', 'user', 'expensive');
            assert.fail('Should have thrown error');
        } catch (e) {
            assert(e.message.includes('500 Server Error'));
        }
        console.log('✅ Error Propagation verified');

        console.log('\n🎉 All tests passed!');

    } catch (e) {
        console.error('❌ Test Failed:', e);
        process.exit(1);
    }
}

runTests();
