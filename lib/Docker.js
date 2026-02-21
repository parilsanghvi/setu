const { spawn, execSync } = require('child_process');
const path = require('path');
const Config = require('./Config');

class Docker {
    constructor() {
        this.enabled = false;
        this.dockerPath = Config.get('DOCKER_PATH') || this.detectDocker();
        this.checkAvailability();
    }

    detectDocker() {
        try {
            return execSync('which docker').toString().trim();
        } catch (e) {
            // Soft failure: return null, do not throw.
            // Setup script warned user, so logs are enough here.
            return null;
        }
    }

    checkAvailability() {
        if (!this.dockerPath) {
            console.warn('[Docker] ⚠️ Docker not configured or not found. Sandboxing DISABLED.');
            this.enabled = false;
            return;
        }

        const check = spawn(this.dockerPath, ['--version']);

        check.on('error', (err) => {
            console.warn(`[Docker] ⚠️ Failed to spawn docker at ${this.dockerPath}: ${err.message}`);
            this.enabled = false;
        });

        check.on('close', (code) => {
            this.enabled = (code === 0);
            if (!this.enabled) {
                console.warn('[Docker] Docker check failed. Sandboxing disabled (unsafe mode).');
            } else {
                console.log(`[Docker] Engine detected at ${this.dockerPath}. Sandboxing ready.`);
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

    console.log(`[Ranabhoomi] Executing: ${this.dockerPath} ${args.join(' ')}`);

    return spawn(this.dockerPath, args, {
        stdio: ['ignore', 'pipe', 'pipe']
    });
}
}

module.exports = new Docker();
