const db = require('./lib/db');

console.log('Resetting TestAgent-1 to IDLE (Simulating Crash)...');
db.db.prepare("UPDATE agents SET status='IDLE', last_heartbeat = (strftime('%s', 'now') - 60) WHERE name='TestAgent-1'").run();

console.log('Done.');
