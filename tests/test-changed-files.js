const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { resolveChangedFiles } = require('../lib/onboarding/changed-files');

const repoRoot = path.resolve(__dirname, '..');
const maliciousBaseRef = "main; echo 'INJECTED' > injected.txt; echo main";

// Call resolveChangedFiles
resolveChangedFiles(maliciousBaseRef, repoRoot);

// Ensure injected.txt was not created
const injectedPath = path.join(repoRoot, 'injected.txt');
if (fs.existsSync(injectedPath)) {
    fs.unlinkSync(injectedPath);
    assert.fail('VULNERABILITY DETECTED: Command injection successful!');
}

console.log('Test passed: Command injection failed.');
