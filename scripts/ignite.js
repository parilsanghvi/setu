const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const bus = require('../lib/db');

console.log('🚀 IGNITING SETU MISSION CONTROL...');

const envPath = path.resolve(__dirname, '../.env');

// Main Execution Flow
(async () => {
    // 0. Check Configuration
    if (!fs.existsSync(envPath)) {
        console.log('⚠️  Configuration (.env) not found.');
        console.log('🛠️  Launching Setup Wizard...');

        await new Promise((resolve, reject) => {
            const setup = spawn('node', ['bin/setup.js'], {
                cwd: path.resolve(__dirname, '..'),
                stdio: 'inherit'
            });
            setup.on('exit', (code) => {
                if (code === 0) resolve();
                else reject(new Error('Setup failed or cancelled.'));
            });
        });

        console.log('✅ Configuration complete. Resuming launch...');
    }

    launchSystem();
})();

function launchSystem() {
    // 1. Ignite Frontend (The Dashboard)
    const frontend = spawn('npm', ['run', 'dev'], {
        cwd: path.resolve(__dirname, '../frontend/app'),
        stdio: 'inherit', // Pipe directly to see Vite output
        shell: true
    });

    // 2. Ignite Backend (The Kernel)
    const backend = spawn('node', ['index.js'], {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'inherit',
    });

    console.log('✅ Systems Launched. Waiting for stabilization (5s)...');

    // 3. Auto-Kickstart (5s Delay)
    setTimeout(() => {
        console.log('⚡ Sending activation signal...');

        // Create a command message
        bus.send(
            'User',
            'Sutradhar',
            'BEGIN AUDIT of adopted project.',
            'command',
            { source: 'ignite-script' }
        );

        console.log('✅ Activation signal sent.');
    }, 5000);


    // Handle Exit
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down Setu...');
        frontend.kill();
        backend.kill();
        process.exit();
    });
}
