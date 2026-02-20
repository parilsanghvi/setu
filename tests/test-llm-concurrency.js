const assert = require('assert');
const Module = require('module');

// Mock dotenv before requiring anything else
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    if (id === 'dotenv') {
        return {
            config: () => ({})
        };
    }
    return originalRequire.apply(this, arguments);
};

const LLM = require('../lib/LLM');

console.log('🧪 Testing lib/LLM.js Concurrency Control...');

(async () => {
    try {
        // --- Test 1: Verify Max Concurrent Limit ---
        console.log('\n--- Test 1: Verifying Max Concurrent Limit (2) ---');

        // Reset state for test
        // LLM is a singleton, so we modify it directly.
        // It's safe because tests run in separate processes.
        LLM._maxConcurrent = 2;
        LLM._activeCalls = 0;
        LLM._queue = [];

        const callLog = [];

        // Create a mock provider that delays response
        const mockProvider = {
            generate: async (sys, user) => {
                const id = user; // Use user prompt as ID
                callLog.push({ id, type: 'start', time: Date.now() });
                // Delay 50ms to ensure overlap if concurrency allows
                await new Promise(resolve => setTimeout(resolve, 50));
                callLog.push({ id, type: 'end', time: Date.now() });
                return `Response for ${id}`;
            }
        };

        // Register mock provider
        LLM.providers.set('mock-concurrent', mockProvider);

        console.log('Starting 3 concurrent requests...');
        // Start 3 concurrent calls.
        // Since _maxConcurrent is 2, the 3rd one should wait.
        const p1 = LLM.generate('sys', '1', 'mock-concurrent');
        const p2 = LLM.generate('sys', '2', 'mock-concurrent');
        const p3 = LLM.generate('sys', '3', 'mock-concurrent');

        await Promise.all([p1, p2, p3]);
        console.log('All requests completed.');

        // Verify start/end counts
        const starts = callLog.filter(e => e.type === 'start');
        const ends = callLog.filter(e => e.type === 'end');

        assert.strictEqual(starts.length, 3, 'Should have 3 starts');
        assert.strictEqual(ends.length, 3, 'Should have 3 ends');

        // Verify Max Concurrency never exceeded 2
        let currentActive = 0;
        let maxObservedActive = 0;

        // Sort log by time to reconstruct timeline accurately
        // (Though push order is usually reliable for sequential logs in same loop, async complicates it)
        // However, since we push synchronously inside generate, the array order reflects execution order.

        for (const event of callLog) {
            if (event.type === 'start') {
                currentActive++;
                if (currentActive > maxObservedActive) {
                    maxObservedActive = currentActive;
                }
            } else {
                currentActive--;
            }
        }

        console.log(`Max observed active calls: ${maxObservedActive}`);
        assert(maxObservedActive <= 2, `Max active calls observed (${maxObservedActive}) should be <= 2`);

        // Verify that the 3rd request started after at least one of the first two finished.

        const start1 = callLog.find(e => e.id === '1' && e.type === 'start');
        const start2 = callLog.find(e => e.id === '2' && e.type === 'start');
        const start3 = callLog.find(e => e.id === '3' && e.type === 'start');

        const end1 = callLog.find(e => e.id === '1' && e.type === 'end');
        const end2 = callLog.find(e => e.id === '2' && e.type === 'end');

        // Check that 3 started AFTER at least one slot became free.
        const idxStart3 = callLog.indexOf(start3);
        const idxEnd1 = callLog.indexOf(end1);
        const idxEnd2 = callLog.indexOf(end2);

        const slotFreed = (idxEnd1 !== -1 && idxStart3 > idxEnd1) || (idxEnd2 !== -1 && idxStart3 > idxEnd2);

        assert(slotFreed, 'Request 3 should have started only after Request 1 or 2 finished');
        console.log('✅ Max concurrency limit respected.');


        // --- Test 2: Verify Error Handling Releases Slot ---
        console.log('\n--- Test 2: Verifying Error Handling Releases Slot ---');

        // Reset with strict limit 1
        LLM._activeCalls = 0;
        LLM._queue = [];
        LLM._maxConcurrent = 1;

        const errorLog = [];

        const errorProvider = {
            generate: async (sys, user) => {
                if (user === 'error') {
                    throw new Error('Mock Error');
                }
                return 'Success';
            }
        };
        LLM.providers.set('mock-error', errorProvider);

        console.log('Starting error request...');
        // Call 1 throws
        let errorCaught = false;
        try {
            await LLM.generate('sys', 'error', 'mock-error');
        } catch (e) {
            errorCaught = true;
            console.log('Caught expected error:', e.message);
        }
        assert(errorCaught, 'Should have caught error from generate');

        // Check active calls is 0
        assert.strictEqual(LLM._activeCalls, 0, 'Active calls should be 0 after error');

        console.log('Starting success request...');
        // Call 2 should proceed immediately
        const pSuccess = LLM.generate('sys', 'success', 'mock-error');
        const result = await pSuccess;

        assert.strictEqual(result, 'Success', 'Second call should succeed');
        assert.strictEqual(LLM._activeCalls, 0, 'Active calls should be 0 after all done');

        console.log('✅ Error handling released slot correctly.');

        console.log('\n🎉 All Concurrency Tests Passed!');

    } catch (e) {
        console.error('\n❌ Test Failed:', e);
        process.exit(1);
    }
})();
