const { spawn } = require('child_process');
const path = require('path');
const bus = require('../lib/db');

console.log('🚀 Spawning Rakshak...');
const rakshak = spawn('node', [path.join(__dirname, '../agents/Rakshak.js')], { stdio: 'inherit' });

setTimeout(() => {
    const agents = bus.db.prepare('SELECT * FROM agents').all();
    console.table(agents);

    const rk = agents.find(a => a.name === 'Rakshak');

    if (rk) {
        console.log('✅ Verification SUCCESS: Rakshak is alive.');
        process.exit(0);
    } else {
        console.error('❌ Verification FAILED: Rakshak not found.');
        process.exit(1);
    }
}, 5000);
