const db = require('../lib/db');
const assert = require('assert');

console.log('🧪 Testing Dashboard Data Sources...');

try {
    // 1. Test Agent Fetching
    const agents = db.db.prepare('SELECT name, role, status, pid FROM agents').all();
    console.log(`✅ Fetched ${agents.length} agents.`);
    assert(Array.isArray(agents), 'Agents should be an array');

    // 2. Test Task Fetching
    const tasks = db.db.prepare('SELECT id, status, owner, title FROM tasks ORDER BY updated_at DESC LIMIT 20').all();
    console.log(`✅ Fetched ${tasks.length} tasks.`);
    assert(Array.isArray(tasks), 'Tasks should be an array');

    // 3. Test Stats (GUI specific)
    const activeAgents = db.db.prepare('SELECT count(*) as count FROM agents WHERE status != "OFFLINE"').get();
    const pendingTasks = db.db.prepare('SELECT count(*) as count FROM tasks WHERE status != "DONE"').get();

    console.log(`✅ Stats: Active Agents=${activeAgents.count}, Pending Tasks=${pendingTasks.count}`);
    assert(typeof activeAgents.count === 'number', 'Active agents count should be a number');
    assert(typeof pendingTasks.count === 'number', 'Pending tasks count should be a number');

    console.log('🎉 All Dashboard Data Tests Passed!');
    process.exit(0);

} catch (e) {
    console.error('❌ Test Failed:', e);
    process.exit(1);
}
