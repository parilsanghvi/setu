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

// Restore original require after tests
test.after(() => {
    if (originalRequire._isMocked) {
        Module.prototype.require = originalRequire;
    }
});

// 2. Load the module under test
delete require.cache[require.resolve('../lib/db')];
const bus = require('../lib/db');

// 3. Define Tests
test('Task Escalation: 3 Failures Block Task', (t) => {
    const taskId = 'TASK-ESCALATE-1';

    // 1st Attempt
    bus.updateTask(taskId, 'TODO', { title: 'Fix Bug' });
    let task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    let meta = JSON.parse(task.meta);
    assert.strictEqual(meta.attempts, 1);
    assert.strictEqual(task.status, 'TODO');

    // 2nd Attempt
    bus.updateTask(taskId, 'FAILED');
    task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    meta = JSON.parse(task.meta);
    assert.strictEqual(meta.attempts, 2);
    assert.strictEqual(task.status, 'FAILED');

    // 3rd Attempt - Should Trigger Escalation
    // Spy on console.warn
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = (msg) => {
        if (msg.includes('ESCALATION') && msg.includes(taskId)) {
            warnCalled = true;
        }
        originalWarn(msg);
    };

    try {
        bus.updateTask(taskId, 'FAILED');
    } finally {
        console.warn = originalWarn;
    }

    // Verify Escalation
    assert.ok(warnCalled, 'Should verify console.warn escalation message');

    task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    meta = JSON.parse(task.meta);
    assert.strictEqual(meta.attempts, 3);
    assert.strictEqual(task.status, 'BLOCKED', 'Task status should be BLOCKED');

    // Verify Alert Message
    const alert = bus.db.prepare("SELECT * FROM messages WHERE type = 'alert' AND content LIKE ? ORDER BY created_at DESC LIMIT 1").get(`%${taskId}%`);
    assert.ok(alert, 'Should send an alert message');
    assert.match(alert.content, /SUDO REQUIRED/, 'Alert content should mention SUDO REQUIRED');
});

test('Task Escalation: DONE bypasses Block', (t) => {
    const taskId = 'TASK-DONE-BYPASS';

    // 1st Attempt
    bus.updateTask(taskId, 'TODO', { title: 'Fix Bug 2' });

    // 2nd Attempt
    bus.updateTask(taskId, 'FAILED');

    // 3rd Attempt (FAILED) -> BLOCKED
    bus.updateTask(taskId, 'FAILED');
    let task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    assert.strictEqual(task.status, 'BLOCKED');

    // Now update to DONE
    // A task moved to DONE should not be blocked, even if it has 3 or more attempts.
    bus.updateTask(taskId, 'DONE');

    task = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    const meta = JSON.parse(task.meta);

    assert.strictEqual(meta.attempts, 3, 'Attempts should remain 3');
    assert.strictEqual(task.status, 'DONE', 'Task should be DONE and not revert to BLOCKED');
});
