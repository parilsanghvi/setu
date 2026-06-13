const db = require('../lib/db');

console.log('🌱 Seeding Swarm Agents...');

const agents = [
    { name: 'Tark', role: 'Tark' },
    { name: 'Shilpi', role: 'Shilpi' },
    { name: 'Koshpal', role: 'Koshpal' },
    { name: 'Rakshak', role: 'Rakshak' },
    { name: 'Vishwakarma', role: 'Vishwakarma' },
    { name: 'Guru', role: 'Guru' }
];

agents.forEach(agent => {
    // We use the Bus heartbeat method to upsert agents, as it handles the logic for us.
    // Although heartbeat is usually for active agents, here we initialize them as OFFLINE.
    // However, the Bus.heartbeat method sets status to IDLE by default or what we pass.
    // But wait, Bus.heartbeat updates `last_heartbeat`.
    // Direct DB insertion might be cleaner for initial seeding to ensure they are OFFLINE.

    const stmt = db.db.prepare(`
    INSERT INTO agents (name, role, status, pid, last_heartbeat)
    VALUES (?, ?, 'OFFLINE', NULL, 0)
    ON CONFLICT(name) DO UPDATE SET
      role = excluded.role,
      status = 'OFFLINE'
  `);

    stmt.run(agent.name, agent.role);
    console.log(`✨ Upserted Agent: ${agent.name} (${agent.role})`);
});

console.log("✅ Swarm Seeded. Run 'node index.js' to boot.");
