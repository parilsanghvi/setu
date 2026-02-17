const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const contextManager = require('../lib/Context');

let tempDir;

try {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setu-context-test-'));
    console.log(`🧪 Testing lib/Context.js in ${tempDir}...`);

    // Test 1: Read existing CONTEXT.md
    const contextContent = '# Test Context';
    fs.writeFileSync(path.join(tempDir, 'CONTEXT.md'), contextContent);
    const readContent = contextManager.read(tempDir);
    assert.strictEqual(readContent, contextContent, 'Should read CONTEXT.md content');

    // Test 2: Read missing CONTEXT.md
    const missingContent = contextManager.read(path.join(tempDir, 'missing'));
    assert.strictEqual(missingContent, null, 'Should return null for missing file');

    // Test 3: Write CONTEXT.md (Success)
    const leadAgent = { name: 'TestLead', role: 'Backend Lead', scope: tempDir };
    const newContent = '# Updated Context';
    contextManager.write(leadAgent, tempDir, newContent);
    const updatedContent = fs.readFileSync(path.join(tempDir, 'CONTEXT.md'), 'utf8');
    assert.strictEqual(updatedContent, newContent, 'Should update CONTEXT.md');

    // Test 4: Write CONTEXT.md (Permission Denied - Role)
    const devAgent = { name: 'TestDev', role: 'Developer', scope: tempDir };
    let caughtPermission = false;
    try {
        contextManager.write(devAgent, tempDir, 'Fail');
    } catch (e) {
        if (e.message.includes('PERMISSION DENIED')) caughtPermission = true;
    }
    assert(caughtPermission, 'Should have thrown PERMISSION DENIED error');

    // Test 5: Write CONTEXT.md (Scope Error)
    const outsideScopeAgent = { name: 'TestLead', role: 'Backend Lead', scope: '/other/path' };
    let caughtScope = false;
    try {
        contextManager.write(outsideScopeAgent, tempDir, 'Fail');
    } catch (e) {
         if (e.message.includes('SCOPE ERROR')) caughtScope = true;
    }
    assert(caughtScope, 'Should have thrown SCOPE ERROR');

    // Test 6: Log to JOURNAL.md
    const logAgent = { name: 'TestLogger', role: 'Any' };
    const logEntry = 'Test log entry';
    contextManager.log(logAgent, tempDir, logEntry);
    const journalContent = fs.readFileSync(path.join(tempDir, 'JOURNAL.md'), 'utf8');
    assert(journalContent.includes(logEntry), 'Should contain log entry');
    assert(journalContent.includes('TestLogger'), 'Should contain agent name');

    console.log('✅ lib/Context.js Tests Passed!');
} catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
} finally {
    if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}
