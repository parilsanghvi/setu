const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Override homedir to use a clean temporary directory for our test DB
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setu-stress-'));
const defaultHomedir = os.homedir;
os.homedir = () => tmpDir;

// Now require db.js so it creates the DB in our tmpDir
const dbBus = require('../lib/db');

test('DB Stress: Concurrent Writes & Event Loop Interleaving', async (t) => {
    const NUM_OPERATIONS = 1500;
    const promises = [];

    // We use setImmediate to interleave operations on the event loop
    // simulating concurrent API requests or Agent heartbeats
    for (let i = 0; i < NUM_OPERATIONS; i++) {
        // Mix task updates and heartbeats randomly
        promises.push(new Promise((resolve) => {
            setImmediate(() => {
                if (i % 2 === 0) {
                    dbBus.updateTask(`STRESS-TASK-${i}`, 'TODO', { title: `Stress Task ${i}` });
                } else {
                    dbBus.heartbeat(`StressAgent-${i}`, 'Testing', 1000 + i, 'BUSY');
                }
                resolve();
            });
        }));
    }

    await Promise.all(promises);

    const tasks = dbBus.getTasks();
    const agents = dbBus.getAgents();

    assert.strictEqual(tasks.length, NUM_OPERATIONS / 2, 'All tasks should be created');
    assert.strictEqual(agents.length, NUM_OPERATIONS / 2, 'All agents should be created');
});

test('DB Resilience: Missing Table Error bubbles up', (t) => {
    // Drop the agents table to simulate corruption
    dbBus.db.exec('DROP TABLE agents');

    // Attempting to heartbeat should now throw an error as SQLite complains about no table
    assert.throws(() => {
        dbBus.heartbeat('test-agent', 'tester', 123, 'IDLE');
    }, /no such table: agents/);

    // We clean up
    dbBus.db.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    os.homedir = defaultHomedir;
});
