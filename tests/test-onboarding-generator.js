const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

let tempDir;
let originalResolve;

try {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setu-generator-test-'));

    // Mock path.resolve to trick generator into using our tempDir as REPO_ROOT
    originalResolve = path.resolve;
    path.resolve = function(...args) {
        if (args.length === 2 && args[0].endsWith(path.join('lib', 'onboarding')) && args[1] === '../../') {
            return tempDir;
        }
        return originalResolve.apply(this, args);
    };

    // Require generator after mocking path.resolve
    const generator = require('../lib/onboarding/generator');

    console.log('🧪 Testing lib/onboarding/generator.js ...');

    // Create a dummy repo structure
    fs.mkdirSync(path.join(tempDir, 'lib'));
    fs.writeFileSync(path.join(tempDir, 'lib/test-file.js'), 'console.log("hello");');
    fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test Repo');
    fs.writeFileSync(path.join(tempDir, 'ONBOARDING.json'), JSON.stringify({}));

    // Create git repository in temp directory to avoid execSync errors
    execSync('git init', { cwd: tempDir, stdio: 'ignore' });
    execSync('git config user.name "Test"', { cwd: tempDir, stdio: 'ignore' });
    execSync('git config user.email "test@test.com"', { cwd: tempDir, stdio: 'ignore' });
    execSync('git add .', { cwd: tempDir, stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { cwd: tempDir, stdio: 'ignore' });

    // --- Test 1: Dry Run ---
    let logs = [];
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].startsWith('[ONBOARDING::DRY-RUN]')) {
            logs.push(args[0]);
        }
        // Uncomment next line to see all dry-run logs if debugging
        // originalConsoleLog.apply(this, args);
    };

    generator.runGenerator({ dryRun: true });

    console.log = originalConsoleLog;

    assert.ok(logs.some(l => l.includes('Creating core artifact: docs/INDEX.md')), 'Should log creating INDEX.md');
    assert.ok(logs.some(l => l.includes('Creating folder summary: docs/folders/lib/SUMMARY.md')), 'Should log creating folder summary');
    assert.ok(logs.some(l => l.includes('Creating file doc: docs/files/lib/test-file.js.md')), 'Should log creating file doc');
    assert.ok(logs.some(l => l.includes('Would calculate status via validator and write ONBOARDING.json')), 'Should log writing JSON');
    console.log('✅ Test 1 Passed: Generator dry run logged expected actions.');

    // --- Test 2: Real Run ---
    // We mock console.log again to swallow the output from the real run so test logs stay clean
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && !args[0].startsWith('[ONBOARDING]')) {
             originalConsoleLog.apply(this, args);
        }
    };

    generator.runGenerator({ dryRun: false });

    console.log = originalConsoleLog;

    // Verify files were actually created
    assert.ok(fs.existsSync(path.join(tempDir, 'docs/INDEX.md')), 'Should create INDEX.md');
    assert.ok(fs.existsSync(path.join(tempDir, 'docs/folders/lib/SUMMARY.md')), 'Should create folder summary');
    assert.ok(fs.existsSync(path.join(tempDir, 'docs/files/lib/test-file.js.md')), 'Should create file doc');
    assert.ok(fs.existsSync(path.join(tempDir, 'ONBOARDING.json')), 'Should write ONBOARDING.json');
    console.log('✅ Test 2 Passed: Generator real run created expected files.');

    console.log('🎉 lib/onboarding/generator.js Tests Passed!');
} catch(e) {
    console.error('❌ Test Failed:', e);
    process.exit(1);
} finally {
    if (originalResolve) {
        path.resolve = originalResolve;
    }
    if (tempDir && fs.existsSync(tempDir)) {
        try { fs.rmSync(tempDir, {recursive: true, force: true}); } catch(e) {}
    }
}
