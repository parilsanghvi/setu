import { test } from 'node:test';
import assert from 'node:assert';
import { updateLogs } from './logUtils.js';

test('updateLogs', async (t) => {
    await t.test('appends single item when under limit', () => {
        const prev = [1, 2];
        const result = updateLogs(prev, 3, 5);
        assert.deepStrictEqual(result, [1, 2, 3]);
    });

    await t.test('appends multiple items when under limit', () => {
        const prev = [1, 2];
        const result = updateLogs(prev, [3, 4], 5);
        assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    await t.test('enforces limit when appending single item causes overflow', () => {
        const prev = [1, 2, 3, 4, 5];
        const result = updateLogs(prev, 6, 5);
        assert.deepStrictEqual(result, [2, 3, 4, 5, 6]);
    });

    await t.test('enforces limit when appending multiple items causes overflow', () => {
        const prev = [1, 2, 3];
        const result = updateLogs(prev, [4, 5, 6], 5);
        assert.deepStrictEqual(result, [2, 3, 4, 5, 6]);
    });

    await t.test('handles new items larger than limit', () => {
        const prev = [1, 2];
        const result = updateLogs(prev, [3, 4, 5, 6, 7, 8], 5);
        assert.deepStrictEqual(result, [4, 5, 6, 7, 8]);
    });

    await t.test('handles empty previous logs', () => {
        const prev = [];
        const result = updateLogs(prev, [1, 2], 5);
        assert.deepStrictEqual(result, [1, 2]);
    });

    await t.test('handles exact limit', () => {
         const prev = [1, 2, 3, 4];
         const result = updateLogs(prev, 5, 5);
         assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
    });

    await t.test('handles empty new items', () => {
         const prev = [1, 2];
         const result = updateLogs(prev, [], 5);
         assert.deepStrictEqual(result, [1, 2]);
    });
});
