const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const testDir = __dirname;
const files = fs.readdirSync(testDir)
    .filter(f => (f.startsWith('test-') || f.startsWith('verify-')) && f.endsWith('.js') && f !== 'runner.js');

console.log(`\n🚀 Setu Test Runner - Found ${files.length} test files.\n`);

async function runTest(file) {
    return new Promise((resolve) => {
        console.log(`Running ${file}...`);
        const start = Date.now();
        const p = spawn('node', [path.join(testDir, file)], {
            stdio: 'inherit',
            env: { ...process.env, LOG_LEVEL: 'error', DASHBOARD_PASS: 'secret' } // Suppress logs during tests
        });

        p.on('exit', (code) => {
            const time = Date.now() - start;
            if (code === 0) {
                console.log(`✅ ${file} PASSED (${time}ms)\n`);
                resolve(true);
            } else {
                console.log(`❌ ${file} FAILED (Exit Code: ${code})\n`);
                resolve(false);
            }
        });
    });
}

(async () => {
    let passed = 0;
    let failed = 0;

    for (const file of files) {
        // Skip list-models as it's interactive/informational
        if (file === 'list-models.js' || file === 'debug-payload.js') continue;

        // Skip verify-llm-connection if LLM provider API key is not set
        if (file === 'verify-llm-connection.js' && !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
            console.log(`⚠️ Skipping ${file} because no LLM API key is set in environment.\n`);
            continue;
        }

        const success = await runTest(file);
        if (success) passed++;
        else failed++;
    }

    console.log('--- Test Summary ---');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total:  ${passed + failed}`);

    if (failed > 0) process.exit(1);
})();
