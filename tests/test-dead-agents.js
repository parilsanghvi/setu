const bus = require('../lib/db');
const assert = require('assert');

console.log('🧪 Testing getDeadAgents...');

const now = Math.floor(Date.now() / 1000);

// Insert Live Agent (Heartbeat just now)
bus.heartbeat('TestLive', 'TestRole', 123, 'IDLE');

// Insert Dead Agent (Manually to set old timestamp - 100s ago)
bus.db.prepare(`
    INSERT INTO agents (name, role, pid, status, last_heartbeat)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET last_heartbeat = excluded.last_heartbeat
`).run('TestDead', 'TestRole', 456, 'OFFLINE', now - 100);

const dead = bus.getDeadAgents(30);
console.log('Dead agents found:', dead);

const deadNames = dead.map(a => a.name);
assert(deadNames.includes('TestDead'), 'Should find dead agent');
assert(!deadNames.includes('TestLive'), 'Should not find live agent');

// Verify structure
const deadAgent = dead.find(a => a.name === 'TestDead');
assert(deadAgent.name, 'Should have name');
assert(deadAgent.role, 'Should have role');

// Cleanup
bus.db.prepare('DELETE FROM agents WHERE name IN (?, ?)').run('TestLive', 'TestDead');

console.log('✅ getDeadAgents Tests Passed!');
