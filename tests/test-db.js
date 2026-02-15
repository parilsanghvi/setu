const bus = require('../lib/db');
const assert = require('assert');

console.log('🧪 Testing lib/db.js (Bus)...');

try {
    // 1. Test Send & Get Unread
    const msgId = bus.send('TestSender', 'TestRecipient', 'Hello World', 'chat');
    assert(msgId > 0, 'Message ID should be positive');

    const unread = bus.getUnread('TestRecipient');
    assert(unread.length > 0, 'Should have unread messages');
    assert.strictEqual(unread[unread.length - 1].content, 'Hello World');

    // 2. Test Mark Read
    bus.markRead([msgId]);
    const unreadAfter = bus.getUnread('TestRecipient');
    // Note: getUnread filters by read_at IS NULL. 
    // If we just marked it read, it should not appear (or be fewer).
    const found = unreadAfter.find(m => m.id === msgId);
    assert(!found, 'Message should be marked read');

    // 3. Test Task Update
    const taskId = 'TEST-TASK-DB-1';
    bus.updateTask(taskId, 'IN_PROGRESS', { owner: 'Tester' });

    const task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    assert.strictEqual(task.status, 'IN_PROGRESS');
    assert.strictEqual(task.owner, 'Tester');

    console.log('✅ lib/db.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/db.js Failed:', e);
    process.exit(1);
}
