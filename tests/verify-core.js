const { spawn } = require('child_process');
const path = require('path');
const bus = require('../lib/db');

// 1. Spawn Tark (BackendLead)
console.log('🚀 Spawning Tark...');
const backend = spawn('node', [path.join(__dirname, '../agents/Tark.js')], { stdio: 'inherit' });

// 2. Spawn Guru (Drona)
console.log('🚀 Spawning Guru...');
const guru = spawn('node', [path.join(__dirname, '../agents/Guru.js')], { stdio: 'inherit' });

// 3. Monitor for 5 seconds
setTimeout(() => {
    // Check if they are in DB
    const agents = bus.db.prepare('SELECT * FROM agents').all();
    console.table(agents);

    const bl = agents.find(a => a.name === 'Tark');
    const gr = agents.find(a => a.name === 'Guru');

    if (bl && gr) {
        console.log('✅ verification SUCCESS: Agents are alive and registered.');
        process.exit(0);
    } else {
        console.error('❌ verification FAILED: Agents not found in DB.');
        process.exit(1);
    }
}, 5000);
