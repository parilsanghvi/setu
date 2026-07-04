const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const drishtiTools = require('../skills/drishti-v2/tools');

describe('Drishti-v2 Security Vulnerability Test', () => {
    it('search_code should not execute injected shell commands', async () => {
        const searchCode = drishtiTools.find(t => t.name === 'search_code');
        assert.ok(searchCode, "search_code tool should be defined");

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drishti-sec-'));
        const sentinelFile = path.join(tmpDir, 'hacked.txt');

        try {
            // Attempt shell injection
            // If shell execution occurs, touch will create sentinelFile
            await searchCode.execute({
                pattern: `hello"; touch ${sentinelFile}; echo "`,
                path: tmpDir
            });

            const fileExists = fs.existsSync(sentinelFile);
            assert.strictEqual(fileExists, false, "Security vulnerability: shell injection allowed in search_code!");
        } finally {
            if (fs.existsSync(sentinelFile)) fs.unlinkSync(sentinelFile);
            fs.rmdirSync(tmpDir);
        }
    });

    it('list_files_recursive should use native walkDir and not execute shell commands', async () => {
        const listFiles = drishtiTools.find(t => t.name === 'list_files_recursive');
        assert.ok(listFiles, "list_files_recursive tool should be defined");

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drishti-walk-'));
        const sentinelFile = path.join(tmpDir, 'hacked2.txt');

        try {
            // Attempt shell injection
            await listFiles.execute({
                dir: `${tmpDir}; touch ${sentinelFile}`
            });

            const fileExists = fs.existsSync(sentinelFile);
            assert.strictEqual(fileExists, false, "Security vulnerability: shell injection allowed in list_files_recursive!");
        } finally {
            if (fs.existsSync(sentinelFile)) fs.unlinkSync(sentinelFile);
            fs.rmdirSync(tmpDir);
        }
    });
});
