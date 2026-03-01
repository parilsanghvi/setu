const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const CoreAgent = require('../lib/CoreAgent');

test('Security: CoreAgent Path Traversal Prevention', async (t) => {
    // Setup temporary directory for agent scope
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-scope-'));
    const outsideFile = path.join(os.tmpdir(), 'secret.txt');

    // Create a file outside the scope
    fs.writeFileSync(outsideFile, 'SECRET_DATA');

    // Create agent with limited scope
    const agent = new CoreAgent('TestAgent', 'Intern', tempDir);

    try {
        // Attempt to read file outside scope using absolute path
        const resultAbsolute = await agent.readFile({ path: outsideFile });

        // Assert that it failed with Access denied
        if (resultAbsolute === 'SECRET_DATA') {
            assert.fail('VULNERABILITY: Agent read absolute path outside scope.');
        } else {
             assert.match(resultAbsolute, /Access denied/, 'Should prevent absolute path access');
        }

        // Attempt to read file using traversal
        // Calculate relative path to outsideFile from tempDir
        const relativePath = path.relative(tempDir, outsideFile);
        const resultRelative = await agent.readFile({ path: relativePath });

        if (resultRelative === 'SECRET_DATA') {
            assert.fail('VULNERABILITY: Agent read relative path via traversal.');
        } else {
             assert.match(resultRelative, /Access denied/, 'Should prevent relative path traversal');
        }

    } finally {
        // Cleanup
        try { fs.rmSync(tempDir, { recursive: true }); } catch (e) {}
        try { fs.unlinkSync(outsideFile); } catch (e) {}
    }
});
