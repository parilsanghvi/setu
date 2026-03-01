const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// 1. Setup Mock for better-sqlite3 to use in-memory DB
const RealDatabase = require('better-sqlite3');
const originalRequire = Module.prototype.require;

// Only mock if not already mocked
if (!originalRequire._isMocked) {
    Module.prototype.require = function(id) {
      if (id === 'better-sqlite3') {
        return class MockDatabase extends RealDatabase {
          constructor(path, options) {
            // Force in-memory database for isolation regardless of path
            super(':memory:', options);
          }
        }
      }
      return originalRequire.apply(this, arguments);
    };
    Module.prototype.require._isMocked = true;
}

// 2. Load the module under test
// We ensure clean load
delete require.cache[require.resolve('../lib/db')];
const bus = require('../lib/db');

// 3. Define Tests

test('Bus: Send & Get Unread', (t) => {
    const msgId = bus.send('Alice', 'Bob', 'Hello Bob', 'chat');
    assert.ok(msgId > 0, 'Message ID should be positive');

    const unread = bus.getUnread('Bob');
    assert.strictEqual(unread.length, 1);
    assert.strictEqual(unread[0].sender, 'Alice');
    assert.strictEqual(unread[0].content, 'Hello Bob');
    assert.strictEqual(unread[0].read_at, null);
});

test('Bus: Mark Read', (t) => {
    const msgId = bus.send('Alice', 'Bob', 'Read Me', 'chat');

    // Verify it is initially unread
    let unread = bus.getUnread('Bob');
    const msg = unread.find(m => m.id === msgId);
    assert.ok(msg, 'Message should be found in unread');

    // Mark as read
    bus.markRead([msgId]);

    // Verify it is no longer in unread list
    unread = bus.getUnread('Bob');
    const found = unread.find(m => m.id === msgId);
    assert.strictEqual(found, undefined, 'Message should not be in unread list');

    // Verify directly in DB that read_at is set
    const row = bus.db.prepare('SELECT * FROM messages WHERE id = ?').get(msgId);
    assert.ok(row.read_at > 0, 'read_at should be set');
});

test('Bus: Mark Read - Empty & Invalid', (t) => {
    // Should not crash
    assert.doesNotThrow(() => bus.markRead([]));
    assert.doesNotThrow(() => bus.markRead([999999])); // Non-existent ID
});

test('Bus: Get Chat History', (t) => {
    const A = 'UserA';
    const B = 'UserB';
    const C = 'UserC';

    // 1. A -> B (Oldest)
    const id1 = bus.send(A, B, 'Msg 1', 'chat');
    bus.db.prepare('UPDATE messages SET created_at = ? WHERE id = ?').run(1000, id1);

    // 2. B -> A (Newer)
    const id2 = bus.send(B, A, 'Msg 2', 'chat');
    bus.db.prepare('UPDATE messages SET created_at = ? WHERE id = ?').run(2000, id2);

    // 3. A -> B (Newest)
    const id3 = bus.send(A, B, 'Msg 3', 'chat');
    bus.db.prepare('UPDATE messages SET created_at = ? WHERE id = ?').run(3000, id3);

    // Noise
    bus.send(C, B, 'Noise', 'chat');

    // 4. System -> ALL
    const id4 = bus.send('System', 'ALL', 'Announcement', 'alert');
    bus.db.prepare('UPDATE messages SET created_at = ? WHERE id = ?').run(4000, id4);

    // Test A <-> B history
    // Should include A->B, B->A, and ALL->...

    const history = bus.getChatHistory(A, B);
    // Should contain id1, id2, id3, id4 in chronological order.

    assert.strictEqual(history.length, 4);
    assert.strictEqual(history[0].id, id1);
    assert.strictEqual(history[1].id, id2);
    assert.strictEqual(history[2].id, id3);
    assert.strictEqual(history[3].id, id4);
});

test('Bus: Get Chat History - Limit', (t) => {
    const A = 'LimitUserA';
    const B = 'LimitUserB';

    for (let i = 0; i < 5; i++) {
        const id = bus.send(A, B, `Msg ${i}`, 'chat');
        // distinct times
        bus.db.prepare('UPDATE messages SET created_at = ? WHERE id = ?').run(10000 + i, id);
    }

    // Limit 2
    // created_at DESC (Newest): 4, 3, 2, 1, 0.
    // Limit 2 -> 4, 3.
    // Reverse -> 3, 4.

    const history = bus.getChatHistory(A, B, 2);
    assert.strictEqual(history.length, 2);
    assert.strictEqual(history[0].content, 'Msg 3');
    assert.strictEqual(history[1].content, 'Msg 4');
});

test('Bus: Task Update', (t) => {
    const taskId = 'TASK-TEST-1';
    bus.updateTask(taskId, 'TODO', { owner: 'Me' });

    let task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    assert.strictEqual(task.status, 'TODO');

    bus.updateTask(taskId, 'DONE');
    task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    assert.strictEqual(task.status, 'DONE');
});

test('Bus: getTasks', (t) => {
    // Ensure clean state before testing
    bus.db.prepare('DELETE FROM tasks').run();

    // Add a couple of tasks
    bus.updateTask('TASK-1', 'TODO', { title: 'Task 1', owner: 'A' });
    bus.updateTask('TASK-2', 'DONE', { title: 'Task 2', owner: 'B' });

    const tasks = bus.getTasks();
    assert.strictEqual(tasks.length, 2, 'Should return all tasks');

    // Sort tasks by ID to ensure deterministic assertions
    tasks.sort((a, b) => a.id.localeCompare(b.id));

    assert.strictEqual(tasks[0].id, 'TASK-1');
    assert.strictEqual(tasks[0].status, 'TODO');

    assert.strictEqual(tasks[1].id, 'TASK-2');
    assert.strictEqual(tasks[1].status, 'DONE');
});

test('Bus: getTaskMeta', (t) => {
    // Ensure clean state before testing
    bus.db.prepare('DELETE FROM tasks').run();

    let meta = bus.getTaskMeta();
    assert.strictEqual(meta.c, 0, 'Count should be 0 when no tasks exist');
    assert.strictEqual(meta.t, null, 'Max updated_at should be null when no tasks exist');

    // Add tasks
    bus.updateTask('TASK-1', 'TODO', { title: 'Task 1' });

    // Slight delay to ensure different updated_at timestamps if database allows precision,
    // though sqlite strftime('%s') is seconds resolution, so we'll force it
    bus.db.prepare('UPDATE tasks SET updated_at = ? WHERE id = ?').run(1000, 'TASK-1');

    bus.updateTask('TASK-2', 'DONE', { title: 'Task 2' });
    bus.db.prepare('UPDATE tasks SET updated_at = ? WHERE id = ?').run(2000, 'TASK-2');

    meta = bus.getTaskMeta();
    assert.strictEqual(meta.c, 2, 'Count should be 2');
    assert.strictEqual(meta.t, 2000, 'Max updated_at should be the latest timestamp');
});
