const { describe, it } = require('node:test');
const assert = require('node:assert');
const { Pariksha } = require('../lib/Pariksha');

describe('Pariksha', () => {
    describe('runTest', () => {
        it('should return success: true when command succeeds', async () => {
            const mockExec = async (file, args, opts) => ({ stdout: 'ok', stderr: '' });
            const pariksha = new Pariksha(mockExec);
            const result = await pariksha.runTest('echo hello', '.');
            assert.strictEqual(result.success, true);
            assert.strictEqual(result.output, 'ok');
        });

        it('should return success: false when command fails', async () => {
            const mockExec = async (file, args, opts) => {
                const err = new Error('Command failed');
                err.stdout = 'stdout';
                err.stderr = 'stderr';
                throw err;
            };
            const pariksha = new Pariksha(mockExec);
            const result = await pariksha.runTest('bad command', '.');
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.output, 'stdoutstderr');
        });
    });

    describe('enforce', () => {
        it('should pass on valid TDD cycle (Red -> Write -> Green)', async () => {
            let callCount = 0;
            const mockExec = async (file, args, opts) => {
                callCount++;
                if (callCount === 1) {
                    // First run: Fail
                    const err = new Error('Fail first');
                    err.stdout = 'fail';
                    err.stderr = '';
                    throw err;
                } else {
                    // Second run: Pass
                    return { stdout: 'pass', stderr: '' };
                }
            };

            const pariksha = new Pariksha(mockExec);
            let codeWritten = false;
            const writeCodeFn = async () => { codeWritten = true; };

            const result = await pariksha.enforce('test cmd', '.', writeCodeFn);

            assert.strictEqual(result, true);
            assert.strictEqual(codeWritten, true);
            assert.strictEqual(callCount, 2);
        });

        it('should throw TDD VIOLATION if test passes initially', async () => {
            const mockExec = async (file, args, opts) => ({ stdout: 'pass', stderr: '' });
            const pariksha = new Pariksha(mockExec);

            await assert.rejects(
                async () => await pariksha.enforce('test cmd', '.', async () => {}),
                /TDD VIOLATION/
            );
        });

        it('should throw CODE FAILURE if test fails after writing code', async () => {
             const mockExec = async (file, args, opts) => {
                const err = new Error('Fail always');
                err.stdout = 'fail';
                err.stderr = '';
                throw err;
            };
            const pariksha = new Pariksha(mockExec);

            await assert.rejects(
                async () => await pariksha.enforce('test cmd', '.', async () => {}),
                /CODE FAILURE/
            );
        });
    });
});
