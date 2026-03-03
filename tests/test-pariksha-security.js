const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Pariksha } = require('../lib/Pariksha');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('Pariksha Security Vulnerability Test', () => {
    it('should not allow shell injection via command parameter', async () => {
        // Create a temporary directory to isolate our tests
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pariksha-sec-'));
        const sentinelFile = path.join(tmpDir, 'hacked.txt');

        // We use the real Pariksha (no mocks) to test actual exec behaviour
        const pariksha = new Pariksha();

        try {
            // Attempt to exploit shell injection.
            // In a shell environment, this would execute 'echo' and then 'touch'.
            // With execFile, the entire string after the command is treated as arguments,
            // or the command parsing logic treats `;` as part of an argument,
            // so `touch` should NOT be executed.
            const result = await pariksha.runTest(`echo "hello"; touch ${sentinelFile}`, tmpDir);

            // Check if the sentinel file was created (which would mean injection succeeded)
            const fileExists = fs.existsSync(sentinelFile);

            // We assert that the file does NOT exist, proving injection failed
            assert.strictEqual(fileExists, false, "Security vulnerability: shell injection allowed execution of arbitrary commands!");

            // The command should likely fail or just print the arguments literally,
            // but we only care that the secondary command wasn't executed.
        } finally {
            // Cleanup
            if (fs.existsSync(sentinelFile)) {
                fs.unlinkSync(sentinelFile);
            }
            fs.rmdirSync(tmpDir);
        }
    });

    it('should correctly parse arguments preserving quotes', async () => {
        const pariksha = new Pariksha();
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pariksha-sec-parse-'));

        try {
            // Test that it can still run actual valid commands with arguments
            // We use node -e to ensure cross-platform compatibility without shell
            const result = await pariksha.runTest(`node -e "console.log('test_arg_parsing')"`, tmpDir);

            assert.strictEqual(result.success, true);
            assert.match(result.output, /test_arg_parsing/);
        } finally {
            fs.rmdirSync(tmpDir);
        }
    });
});
