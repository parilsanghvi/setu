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

    await t.test('returns empty array when maxLogs is 0', () => {
        const prev = [1, 2];
        const result = updateLogs(prev, 3, 0);
        assert.deepStrictEqual(result, []);
    });

    await t.test('returns empty array when maxLogs is negative', () => {
        const prev = [1, 2];
        const result = updateLogs(prev, [3, 4], -5);
        assert.deepStrictEqual(result, []);
    });

    await t.test('handles undefined previous logs', () => {
        const result = updateLogs(undefined, [1, 2], 5);
        assert.deepStrictEqual(result, [1, 2]);
    });

    await t.test('handles null previous logs', () => {
        const result = updateLogs(null, [1, 2], 5);
        assert.deepStrictEqual(result, [1, 2]);
    });

    await t.test('uses default maxLogs limit when not provided', () => {
        // Default maxLogs is 500
        const prev = Array(499).fill('log');
        const result = updateLogs(prev, ['newLog1', 'newLog2']);
        assert.strictEqual(result.length, 500);
        assert.strictEqual(result[498], 'newLog1');
        assert.strictEqual(result[499], 'newLog2');
    });

    await t.test('trims previous logs if they already exceed maxLogs', () => {
        const prev = [1, 2, 3, 4, 5, 6];
        const result = updateLogs(prev, [7, 8], 5);
        assert.deepStrictEqual(result, [4, 5, 6, 7, 8]);
    });
});
