const Intern = require('../agents/Intern');
const BackendLead = require('../agents/BackendLead');
const bus = require('../lib/db');
const fs = require('fs');
const path = require('path');

async function testInternGate() {
    console.log('--- 🐣 Testing Intern Approval Protocol ---');

    const internId = 'Intern-1';
    const taskId = 'TASK-RISKY-INTERN';
    const scope = path.join(process.cwd(), 'temp_intern_scope');

    const backend = new BackendLead('Backend-Lead-Test', 'BackendLead');
    const intern = new Intern(internId, 'Intern', scope, 'Backend-Lead-Test');

    // 1. Intern initiates a risky task
    console.log('1. Intern proposing a RISKY task (DROP TABLE)...');

    // Mock the LLM to return a risky plan if prompted
    // In actual run, the Intern.generatePlan will call LLM.
    // For this test, we'll manually trigger handleInternProposal with a risky plan file.

    if (!fs.existsSync(scope)) fs.mkdirSync(scope);
    const planPath = path.join(scope, 'PLAN.md');
    fs.writeFileSync(planPath, '# RISKY PLAN\nIn this task, I will drop the users table to clean up the DB.');

    // 2. Mock Backend Lead receiving the proposal
    console.log('2. Backend Lead reviewing the proposal...');
    await backend.handleInternProposal({
        sender: internId,
        type: 'proposal',
        meta: { taskId, planPath }
    });

    // 3. Check if escalation message exists in DB
    const msgs = bus.db.prepare("SELECT * FROM messages WHERE type = 'escalation' AND recipient = 'Narad'").all();
    if (msgs.length > 0) {
        console.log('✅ Escalation to Narad successful! Message:', msgs[0].content);
        console.log('✅ HUMAN GATE triggered successfully.');
    } else {
        console.error('❌ Human Gate failed to trigger!');
    }

    // Clean up
    fs.rmSync(scope, { recursive: true, force: true });
    process.exit(0);
}

testInternGate();
