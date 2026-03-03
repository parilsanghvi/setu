const Vishwakarma = require('../agents/Vishwakarma');
const contractor = require('../lib/Contractor');
const fs = require('fs');
const path = require('path');
const LLM = require('../lib/LLM');

// MOCK LLM
LLM.generate = async (system, prompt) => {
    if (prompt.includes("sudo") || prompt.includes("host machine")) return "VETO: Violation of Isolation Principle.";
    if (prompt.includes("missing USER")) return "WARNING: Missing USER instruction.";
    return "APPROVED";
};

async function testVishwakarma() {
    console.log('--- 🏗️ Testing Vishwakarma (The Divine Architect) ---');

    const agent = new Vishwakarma('Vishwakarma-Test', 'Vishwakarma');

    // Test 1: Veto a bad spec
    console.log('\n1. Testing Veto on Bad Spec...');
    const badTaskId = 'TASK-INFRA-BAD';
    const badSpec = "We will just run the app on the host machine using sudo node server.js. No Docker needed.";

    // ISSUE SPEC FIRST
    contractor.issueSpec(badTaskId, 'infra', badSpec);

    await agent.handleSpecProposal({
        sender: 'Sutradhar',
        content: badSpec,
        meta: { taskId: badTaskId, type: 'PROPOSE_SPEC', domain: 'infra' }
    });

    const badContract = contractor.getSpec(badTaskId);
    if (badContract && badContract.status === 'VETOED') {
        console.log('✅ Correctly VETOED unsafe spec.');
    } else {
        console.error('❌ Failed to VETO unsafe spec!');
    }

    // Test 2: Approve a good spec
    console.log('\n2. Testing Approval on Good Spec...');
    const goodTaskId = 'TASK-INFRA-GOOD';
    const goodSpec = "We will use a Dockerfile based on node:18-alpine. It will run as a non-root user 'node'. Healthchecks enabled.";

    // ISSUE SPEC FIRST
    contractor.issueSpec(goodTaskId, 'infra', goodSpec);

    await agent.handleSpecProposal({
        sender: 'Sutradhar',
        content: goodSpec,
        meta: { taskId: goodTaskId, type: 'PROPOSE_SPEC', domain: 'infra' }
    });

    const goodContract = contractor.getSpec(goodTaskId);
    if (goodContract && goodContract.status === 'APPROVED') {
        console.log('✅ Correctly APPROVED safe spec.');
    } else {
        console.error('❌ Failed to APPROVE safe spec!');
    }

    // Test 3: Audit File
    console.log('\n3. Testing File Audit...');
    const badDockerPath = path.join(__dirname, 'temp_bad_dockerfile');
    fs.writeFileSync(badDockerPath, "FROM ubuntu\nRUN echo 'I am root' && whoami"); // Missing USER non-root

    await agent.auditInfraFile(badDockerPath, 'Intern');

    fs.unlinkSync(badDockerPath);
    console.log('✅ Audit simulation complete (Check logs for WARNING).');

    process.exit(0);
}

testVishwakarma();
