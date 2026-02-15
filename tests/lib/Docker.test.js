const child_process = require('child_process');
const Config = require('../../lib/Config');

// Mock child_process and Config
jest.mock('child_process');
jest.mock('../../lib/Config');

describe('Docker', () => {
    let Docker;

    beforeEach(() => {
        jest.resetModules();
        // Reset mocks
        child_process.spawn.mockReset();
        child_process.execSync.mockReset();

        // Default Config mock
        Config.get.mockReturnValue(null);
    });

    test('should auto-detect docker path if not configured', () => {
        child_process.execSync.mockReturnValue('/usr/local/bin/docker\n');

        // Mock spawn for availability check
        const mockSpawn = {
            on: jest.fn((event, cb) => {
                if (event === 'close') cb(0);
            })
        };
        child_process.spawn.mockReturnValue(mockSpawn);

        // Re-require Docker to trigger constructor
        Docker = require('../../lib/Docker');

        expect(child_process.execSync).toHaveBeenCalledWith('which docker');
        expect(Docker.dockerPath).toBe('/usr/local/bin/docker');
        expect(Docker.enabled).toBe(true);
    });

    test('should disable sandboxing if docker not found', () => {
        // Soft failure: execSync throws -> return null
        child_process.execSync.mockImplementation(() => { throw new Error('Not found'); });

        Docker = require('../../lib/Docker');

        expect(Docker.dockerPath).toBeNull();
        expect(Docker.enabled).toBe(false);
    });

    test('should use configured DOCKER_PATH', () => {
        Config.get.mockImplementation((key) => {
            if (key === 'DOCKER_PATH') return '/custom/docker';
        });

        const mockSpawn = {
            on: jest.fn((event, cb) => {
                if (event === 'close') cb(0);
            })
        };
        child_process.spawn.mockReturnValue(mockSpawn);

        Docker = require('../../lib/Docker');

        expect(Docker.dockerPath).toBe('/custom/docker');
        expect(child_process.execSync).not.toHaveBeenCalled();
    });

    test('run should spawn process with correct args', () => {
        // Setup enabled docker
        child_process.execSync.mockReturnValue('/bin/docker');
        const mockCheck = { on: (evt, cb) => evt === 'close' && cb(0) };
        child_process.spawn.mockReturnValueOnce(mockCheck); // for checkAvailability

        Docker = require('../../lib/Docker');

        // Setup run mock
        const mockProcess = {};
        child_process.spawn.mockReturnValue(mockProcess); // for run

        Docker.run('node:alpine', ['node', '-v'], {
            mounts: [{ host: '/local', container: '/app', mode: 'ro' }],
            env: { GOAL: 'test' }
        });

        expect(child_process.spawn).toHaveBeenLastCalledWith(
            '/bin/docker',
            [
                'run', '--rm', '--network', 'none',
                '-v', '/local:/app:ro',
                '-e', 'GOAL=test',
                'node:alpine', 'node', '-v'
            ],
            expect.anything()
        );
    });
});
