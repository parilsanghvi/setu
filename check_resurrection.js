const db = require('./lib/db');

const agent = db.db.prepare("SELECT * FROM agents WHERE name='TestAgent-1'").get();
console.log('Agent State:', agent);

// Check if PID is new (Requires knowing old PID, but if it exists and heartbeats, good enough)
if (agent.status === 'IDLE' || agent.status === 'BUSY') {
    console.log('✅ Agent is alive!');
} else {
    console.log('❌ Agent is dead/offline.');
}
