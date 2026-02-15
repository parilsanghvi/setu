const { spawn } = require('child_process');
const path = require('path');

class Docker {
    constructor() {
        this.enabled = false;
        this.checkAvailability();
    }

    checkAvailability() {
        const check = spawn('/home/paril/bin/docker', ['--version']);
        check.on('close', (code) => {
            this.enabled = (code === 0);
            if (!this.enabled) {
                console.warn('[Docker] Docker not found. Sandboxing disabled (unsafe mode).');
            } else {
                console.log('[Docker] Engine detected. Sandboxing ready.');
            }
        });
    }

    /**
     * Spawns a process inside a container
     * @param {string} image - Docker image (e.g., 'node:18-alpine')
     * @param {string[]} cmd - Command to run
     * @param {object} options - { mounts: [{host, container, mode}], env: {} }
     */
    run(image, cmd, options = {}) {
        if (!this.enabled) {
            throw new Error("Docker is not available.");
        }

        const args = ['run', '--rm', '--network', 'none']; // Network disabled by default

        // Mounts
        if (options.mounts) {
            options.mounts.forEach(m => {
                const mode = m.mode ? `:${m.mode}` : ''; // :ro or :rw
                args.push('-v', `${m.host}:${m.container}${mode}`);
            });
        }

        // Env vars
        if (options.env) {
            Object.entries(options.env).forEach(([k, v]) => {
                args.push('-e', `${k}=${v}`);
            });
        }

        // Image and Command
        args.push(image);
        args.push(...cmd);

        console.log(`[Ranabhoomi] Executing: /home/paril/bin/docker ${args.join(' ')}`);

        return spawn('/home/paril/bin/docker', args, {
            stdio: ['ignore', 'pipe', 'pipe']
        });
    }
}

module.exports = new Docker();
