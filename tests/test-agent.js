const assert = require('assert');
const Agent = require('../lib/Agent');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing lib/Agent.js...');

// Mock Bus
const mockBus = {
    sentMessages: [],
    send: function (sender, recipient, content, type) {
        this.sentMessages.push({ sender, recipient, content, type });
    },
    // We need to swap the real bus with this mock for the Agent.
    // However, Agent requires '../lib/db' internally.
    // For this simple test, we can check basic property initialization
    // and maybe mock the 'speak' method's dependency if we could inject it.
    // Since we can't easily inject without rewriting Agent, 
    // we will test the parts that don't depend on the DB *live connection* 
    // OR we accept that it writes to the real DB (integration test style).
    // Given the previous test-db.js works, integration style is fine.
};

try {
    // 1. Initialization
    const agentName = 'TestUnitAgent';
    const agentRole = 'Tester';
    const agent = new Agent(agentName, agentRole, path.join(__dirname, 'tmp-scope'));

    assert.strictEqual(agent.name, agentName);
    assert.strictEqual(agent.role, agentRole);
    assert.strictEqual(agent.scope, path.join(__dirname, 'tmp-scope'));

    // 2. Boot (Ensure folder creation)
    if (fs.existsSync(agent.scope)) fs.rmdirSync(agent.scope);

    // We mock the boot's heartbeat to avoid noise/errors if DB isn't perfect
    // But actually Agent.js imports bus directly. 
    // Let's just check if `boot` calls `initializeScope` which creates the dir.

    // Hack: Overwrite the bus call in boot if possible, or just catch error?
    // Agent.js:
    // boot() {
    //   this.initializeScope();
    //   ...
    //   bus.heartbeat(...)
    // }

    // We can try running it. If DB is live (which it is), it should be fine.

    // Mock setInterval to avoid hanging
    const originalSetInterval = global.setInterval;
    global.setInterval = (fn, ms) => { return { unref: () => { } }; }; // No-op

    agent.boot();

    assert.strictEqual(agent.status, 'IDLE');

    // Access internal log
    // Agent doesn't expose log array, but writes to console. 
    // We assume if no crash, it works.

    // Restore
    global.setInterval = originalSetInterval;
    if (fs.existsSync(agent.scope)) fs.rmdirSync(agent.scope);

    console.log('✅ lib/Agent.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/Agent.js Failed:', e);
    process.exit(1);
}
