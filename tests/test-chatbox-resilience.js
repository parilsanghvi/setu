const test = require('node:test');
const assert = require('node:assert');

/**
 * Ported filter logic from ChatBox.jsx to verify resilience.
 */
function filterChatLogs(logs) {
    return logs.filter(l => typeof l.content === 'string' && l.content.startsWith('[CHAT]'));
}

test('ChatBox Logic Resilience', async (t) => {
    await t.test('filters standard chat strings', () => {
        const logs = [
            { id: 1, content: '[CHAT] User -> Tark: Hello' },
            { id: 2, content: '[SUTRADHAR] System boot' },
            { id: 3, content: '[CHAT] Tark -> User: HI' }
        ];
        const result = filterChatLogs(logs);
        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].id, 1);
        assert.strictEqual(result[1].id, 3);
    });

    await t.test('ignores non-string content (objects)', () => {
        const logs = [
            { id: 1, content: { type: 'event', data: 'something' } },
            { id: 2, content: '[CHAT] User -> Tark: Hello' },
            { id: 3, content: null },
            { id: 4, content: undefined }
        ];
        const result = filterChatLogs(logs);
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].id, 2);
    });

    await t.test('ignores strings without [CHAT] prefix', () => {
        const logs = [
            { id: 1, content: 'Some random log' },
            { id: 2, content: '[INFO] Some info' },
            { id: 3, content: '[CHAT] Real chat' }
        ];
        const result = filterChatLogs(logs);
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].content, '[CHAT] Real chat');
    });

    await t.test('handles empty logs array', () => {
        const result = filterChatLogs([]);
        assert.strictEqual(result.length, 0);
    });
});
