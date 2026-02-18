const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { Contractor } = require('../lib/Contractor');

const TEST_FILE = path.join(process.cwd(), 'test-contracts.json');

console.log('🧪 Testing Contractor...');

// Cleanup helper
function cleanup() {
    if (fs.existsSync(TEST_FILE)) {
        fs.unlinkSync(TEST_FILE);
    }
}

// Ensure clean state
cleanup();

try {
    // Test 1: Initialization with missing file
    console.log('Test 1: Initialization with missing file');
    const contractor = new Contractor(TEST_FILE);
    assert.deepStrictEqual(contractor.contracts, {}, 'Should load empty object for missing file');

    // Test 2: issueSpec
    console.log('Test 2: issueSpec');
    const taskId = 'TASK-1';
    const domain = 'TestDomain';
    const spec = { key: 'value' };

    contractor.issueSpec(taskId, domain, spec);

    assert.ok(fs.existsSync(TEST_FILE), 'File should be created');
    const content = JSON.parse(fs.readFileSync(TEST_FILE, 'utf8'));
    assert.ok(content[taskId], 'Task entry should exist');
    assert.strictEqual(content[taskId].status, 'PROPOSED');
    assert.strictEqual(content[taskId].domain, domain);
    assert.deepStrictEqual(content[taskId].spec, spec);

    // Test 3: recordVeto
    console.log('Test 3: recordVeto');
    contractor.recordVeto(taskId, 'AgentA', 'Reason A');

    const contentVeto = JSON.parse(fs.readFileSync(TEST_FILE, 'utf8'));
    assert.strictEqual(contentVeto[taskId].status, 'VETOED');
    assert.strictEqual(contentVeto[taskId].vetoes.length, 1);
    assert.strictEqual(contentVeto[taskId].vetoes[0].agent, 'AgentA');

    // Test 4: approve
    console.log('Test 4: approve');
    contractor.approve(taskId);

    const contentApprove = JSON.parse(fs.readFileSync(TEST_FILE, 'utf8'));
    assert.strictEqual(contentApprove[taskId].status, 'APPROVED');

    // Test 5: getSpec
    console.log('Test 5: getSpec');
    const retrievedSpec = contractor.getSpec(taskId);
    assert.strictEqual(retrievedSpec.status, 'APPROVED');
    assert.deepStrictEqual(retrievedSpec.spec, spec);

    // Test 6: Persistence (New instance loading same file)
    console.log('Test 6: Persistence');
    const contractor2 = new Contractor(TEST_FILE);
    assert.deepStrictEqual(contractor2.getSpec(taskId).spec, spec);
    assert.strictEqual(contractor2.getSpec(taskId).status, 'APPROVED');

    console.log('✅ Contractor Tests Passed!');

} catch (e) {
    console.error('❌ Contractor Tests Failed:', e);
    process.exit(1);
} finally {
    cleanup();
}
