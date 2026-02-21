const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const EventEmitter = require('events');

// Helper to mock require
const originalRequire = Module.prototype.require;
let mockConfig = {};
let mockSpawn = () => {};
let mockExecSync = () => {};

Module.prototype.require = function (id) {
    if (id.endsWith('/lib/Config') || id === './Config') {
        return {
            get: (key) => mockConfig[key]
        };
    }
    if (id === 'child_process') {
        return {
            spawn: (...args) => mockSpawn(...args),
            execSync: (...args) => mockExecSync(...args)
        };
    }
    return originalRequire.apply(this, arguments);
};

function resetDockerModule() {
    const resolved = require.resolve('../lib/Docker');
    delete require.cache[resolved];
}

test('Docker Module Tests', async (t) => {

    // Restore original require after tests
    t.after(() => {
        Module.prototype.require = originalRequire;
    });

    t.beforeEach(() => {
        mockConfig = {};
        // Default mocks
        mockSpawn = () => {
            const cp = new EventEmitter();
            process.nextTick(() => cp.emit('close', 0)); // Default success
            return cp;
        };
        mockExecSync = () => '';
        resetDockerModule();
    });

    await t.test('detectDocker finds docker via execSync when Config is empty', () => {
        mockConfig = {};
        mockExecSync = (cmd) => {
            if (cmd === 'which docker') return '/usr/bin/docker\n';
            throw new Error('Unknown command');
        };

        // Mock spawn for availability check
        mockSpawn = (cmd, args) => {
            const cp = new EventEmitter();
            process.nextTick(() => cp.emit('close', 0));
            return cp;
        };

        const Docker = require('../lib/Docker');
        assert.strictEqual(Docker.dockerPath, '/usr/bin/docker');

        // Wait for async checkAvailability
        return new Promise(resolve => setTimeout(() => {
            assert.strictEqual(Docker.enabled, true);
            resolve();
        }, 20));
    });

    await t.test('respects configured DOCKER_PATH', () => {
        mockConfig = { 'DOCKER_PATH': '/custom/docker' };
        mockExecSync = () => { throw new Error('Should not be called'); };

        const Docker = require('../lib/Docker');
        assert.strictEqual(Docker.dockerPath, '/custom/docker');
    });

    await t.test('disables if docker not found', () => {
        mockConfig = {};
        mockExecSync = () => { throw new Error('Command failed'); };

        const Docker = require('../lib/Docker');
        assert.strictEqual(Docker.dockerPath, null);
        assert.strictEqual(Docker.enabled, false);
    });

    await t.test('disables if availability check fails', () => {
        mockConfig = { 'DOCKER_PATH': '/bin/docker' };

        mockSpawn = (cmd, args) => {
            const cp = new EventEmitter();
            // Simulate failure
            process.nextTick(() => cp.emit('close', 1));
            return cp;
        };

        const Docker = require('../lib/Docker');

        return new Promise(resolve => setTimeout(() => {
            assert.strictEqual(Docker.enabled, false);
            resolve();
        }, 20));
    });

    await t.test('run executes spawn with correct arguments', () => {
        mockConfig = { 'DOCKER_PATH': '/bin/docker' };

        let spawnCalls = [];
        mockSpawn = (cmd, args, options) => {
            spawnCalls.push({ cmd, args, options });
            const cp = new EventEmitter();
            process.nextTick(() => cp.emit('close', 0));
            return cp;
        };

        const Docker = require('../lib/Docker');

        // Wait for init
        return new Promise(resolve => setTimeout(() => {
            assert.strictEqual(Docker.enabled, true);

            Docker.run('node:alpine', ['-v'], {
                mounts: [{ host: '/host', container: '/container', mode: 'ro' }],
                env: { 'TEST_VAR': 'val' }
            });

            // The first call was checkAvailability, second is run
            assert.strictEqual(spawnCalls.length, 2);
            const runCall = spawnCalls[1];

            assert.strictEqual(runCall.cmd, '/bin/docker');
            // Check args
            const expectedArgs = [
                'run', '--rm', '--network', 'none',
                '-v', '/host:/container:ro',
                '-e', 'TEST_VAR=val',
                'node:alpine', '-v'
            ];
            assert.deepStrictEqual(runCall.args, expectedArgs);
            assert.deepStrictEqual(runCall.options, { stdio: ['ignore', 'pipe', 'pipe'] });

            resolve();
        }, 20));
    });

    await t.test('run throws if not enabled', () => {
        mockConfig = {};
        mockExecSync = () => { throw new Error('Not found'); };

        const Docker = require('../lib/Docker');

        // Wait for init to confirm disabled
        return new Promise(resolve => setTimeout(() => {
            assert.strictEqual(Docker.enabled, false);
            assert.throws(() => {
                Docker.run('image', ['cmd']);
            }, /Docker is not available/);
            resolve();
        }, 20));
    });
});
