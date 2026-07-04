const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { resolveChangedFiles } = require('../lib/onboarding/changed-files');

describe('Changed Files Security Vulnerability Test', () => {
    it('should not allow command injection via environment variables or event payload', () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changed-files-sec-'));
        const sentinelFile = path.join(tmpDir, 'hacked.txt');
        const eventFilePath = path.join(tmpDir, 'event.json');

        // Write a payload that tries to execute a command via prNumber if a shell were spawned.
        const payload = {
            pull_request: {
                number: `123; touch ${sentinelFile}`
            }
        };
        fs.writeFileSync(eventFilePath, JSON.stringify(payload));

        // Backup env
        const oldEventPath = process.env.GITHUB_EVENT_PATH;
        const oldRepo = process.env.GITHUB_REPOSITORY;
        const oldToken = process.env.GITHUB_TOKEN;

        process.env.GITHUB_EVENT_PATH = eventFilePath;
        process.env.GITHUB_REPOSITORY = 'test/repo';
        process.env.GITHUB_TOKEN = 'dummy_token';

        try {
            // Call resolveChangedFiles
            // It will trigger curl command execution.
            // Since it uses execFileSync, the arguments containing semicolons and touch command
            // will be passed as a single literal argument to curl, and curl will fail to connect.
            // A shell is not spawned, so the touch command should not execute.
            resolveChangedFiles('main', tmpDir);

            const fileExists = fs.existsSync(sentinelFile);
            assert.strictEqual(fileExists, false, "Security vulnerability: shell injection allowed in getGitHubApiChanges!");
        } finally {
            // Restore env
            if (oldEventPath) process.env.GITHUB_EVENT_PATH = oldEventPath;
            else delete process.env.GITHUB_EVENT_PATH;
            
            if (oldRepo) process.env.GITHUB_REPOSITORY = oldRepo;
            else delete process.env.GITHUB_REPOSITORY;

            if (oldToken) process.env.GITHUB_TOKEN = oldToken;
            else delete process.env.GITHUB_TOKEN;

            if (fs.existsSync(sentinelFile)) fs.unlinkSync(sentinelFile);
            if (fs.existsSync(eventFilePath)) fs.unlinkSync(eventFilePath);
            fs.rmdirSync(tmpDir);
        }
    });
});
