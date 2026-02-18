const assert = require('assert');
const Agent = require('../lib/Agent');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing lib/Agent.js...');

// Mock Bus
const mockBus = {
    sentMessages: [],
    heartbeats: [],
    readMarkers: [],

    send: function (sender, recipient, content, type) {
        this.sentMessages.push({ sender, recipient, content, type });
    },

    heartbeat: function (name, role, pid, status) {
        this.heartbeats.push({ name, role, pid, status });
    },

    getUnread: function (recipient) {
        // Return dummy messages if needed
        return [];
    },

    markRead: function (ids) {
        this.readMarkers.push(...ids);
    }
};

try {
    // 1. Initialization
    const agentName = 'TestUnitAgent';
    const agentRole = 'Tester';
    const agentScope = path.join(__dirname, 'tmp-scope');

    // Inject mockBus
    const agent = new Agent(agentName, agentRole, agentScope, mockBus);

    assert.strictEqual(agent.name, agentName);
    assert.strictEqual(agent.role, agentRole);
    assert.strictEqual(agent.scope, agentScope);
    assert.strictEqual(agent.bus, mockBus);

    // 2. Boot (Ensure folder creation)
    if (fs.existsSync(agent.scope)) fs.rmdirSync(agent.scope);

    // Mock setInterval to prevent hanging
    const originalSetInterval = global.setInterval;
    // We store the callback to manually trigger if needed, or just ignore.
    global.setInterval = (fn, ms) => {
        return { unref: () => { } };
    };

    agent.boot();

    // Verify Heartbeat called on boot
    const initialHeartbeat = mockBus.heartbeats.find(h => h.status === 'IDLE');
    assert.ok(initialHeartbeat, 'Initial IDLE heartbeat should be sent');
    assert.strictEqual(initialHeartbeat.name, agentName);

    // Check status
    assert.strictEqual(agent.status, 'IDLE');

    // Restore
    global.setInterval = originalSetInterval;

    // Cleanup
    if (fs.existsSync(agent.scope)) fs.rmdirSync(agent.scope);

    console.log('✅ lib/Agent.js Tests Passed!');

} catch (e) {
    console.error('❌ lib/Agent.js Failed:', e);
    process.exit(1);
}
