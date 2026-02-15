const bus = require('../lib/db');
const contractor = require('../lib/Contractor');
const BackendLead = require('../agents/BackendLead');

async function testDictator() {
    console.log('--- 🔨 Testing The Dictator Model ---');

    const taskId = 'TASK-VETO-TEST';
    const backend = new BackendLead('Backend-Lead-Test', 'BackendLead');

    // 1. Narad issues a bad spec
    console.log('1. Narad issues a spec with console.logs (The Purist will hate this)...');
    const badSpec = 'Develop a new user login route. Use console.log for debugging errors.';
    contractor.issueSpec(taskId, 'backend', badSpec);

    // 2. backend evaluates and vetos
    console.log('2. Backend Lead evaluates the spec...');
    await backend.handleSpecProposal({
        sender: 'Narad',
        content: badSpec,
        meta: { taskId, type: 'PROPOSE_SPEC' }
    });

    const specAfterVeto = contractor.getSpec(taskId);
    if (specAfterVeto.status === 'VETOED') {
        console.log(`✅ Veto successfully recorded: ${specAfterVeto.vetoes[0].reason}`);
    } else {
        console.error('❌ Veto not recorded!');
    }

    // 3. Testing 3-Strike Escalation
    console.log('\n--- 🚨 Testing 3-Strike Escalation ---');
    bus.updateTask(taskId, 'TODO', { owner: 'BackendLead', attempts: 0 }); // attempt 1
    bus.updateTask(taskId, 'TODO', { owner: 'BackendLead' }); // attempt 2
    bus.updateTask(taskId, 'TODO', { owner: 'BackendLead' }); // attempt 3 -> Should ESCALATE

    const finalTask = bus.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    const meta = JSON.parse(finalTask.meta);

    if (finalTask.status === 'BLOCKED' && meta.attempts >= 3) {
        console.log(`✅ Escalation triggered! Status: ${finalTask.status}, Attempts: ${meta.attempts}`);
    } else {
        console.error('❌ Escalation failed! Task state:', finalTask);
    }

    process.exit(0);
}

testDictator();
