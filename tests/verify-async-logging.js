const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../setu.log');
const SCRIPT_PATH = path.join(__dirname, '../index.js');

// Helper to remove log file before test
if (fs.existsSync(LOG_FILE)) {
    fs.unlinkSync(LOG_FILE);
}

console.log('🚀 Starting Verification: Async Logging in index.js');

const child = spawn('node', [SCRIPT_PATH], {
    env: { ...process.env, PORT: '0', DASHBOARD_PASS: 'test' },
    stdio: 'ignore' // We don't care about stdout/stderr since logs go to file
});

const startTime = Date.now();
const TIMEOUT = 10000; // 10 seconds

const checkLog = setInterval(() => {
    if (Date.now() - startTime > TIMEOUT) {
        console.error('❌ Timeout waiting for log file.');
        clearInterval(checkLog);
        child.kill('SIGKILL');
        process.exit(1);
    }

    if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        if (content.includes('Server running on')) {
            console.log('✅ Log file found and contains expected startup messages.');
            console.log('Sample content:', content.split('\n')[0]);
            clearInterval(checkLog);
            child.kill('SIGTERM');
            console.log('🎉 Verification PASSED');
            process.exit(0);
        }
    }
}, 500);
