const docker = require('../lib/Docker');

async function test() {
    console.log('Testing Ranabhoomi (Docker Sandbox)...');

    // Give it a moment to check availability
    setTimeout(() => {
        if (!docker.enabled) {
            console.log('⚠️ Docker not enabled. Skipping test.');
            process.exit(0);
        }

        try {
            const child = docker.run('node:18-alpine', ['node', '-e', 'console.log("Hello from Ranabhoomi")'], {
                mounts: [{ host: process.cwd(), container: '/app', mode: 'ro' }]
            });

            child.stdout.on('data', (d) => console.log(`[STDOUT] ${d}`));
            child.stderr.on('data', (d) => console.error(`[STDERR] ${d}`));
            child.on('exit', (code) => {
                console.log(`Child exited with code ${code}`);
                if (code === 0) console.log('✅ Ranabhoomi Test Passed');
                else console.error('❌ Ranabhoomi Test Failed');
            });
        } catch (e) {
            console.error('❌ Error:', e);
        }
    }, 1000);
}

test();
