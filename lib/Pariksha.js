const { execFile } = require('child_process');
const util = require('util');
const defaultExecPromise = util.promisify(execFile);
const Logger = require('./Logger');

class Pariksha {
    constructor(execPromise, logger) {
        this.execPromise = execPromise || defaultExecPromise;
        this.logger = logger || new Logger('Pariksha');
    }

    /**
     * Run a specific test command
     * @param {string} command - e.g. "npm test tests/my-feature.test.js"
     * @param {string} cwd - Working directory
     * @returns {Promise<{success: boolean, output: string}>}
     */
    async runTest(command, cwd) {
        try {
            // Parse command string into file and arguments
            const parts = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
            const args = parts.map(arg => {
                if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
                    return arg.slice(1, -1);
                }
                return arg;
            });
            const file = args.shift();

            if (!file) {
                return { success: false, output: 'Empty command' };
            }

            // Use execPromise (which wraps execFile) to prevent shell injection
            const { stdout, stderr } = await this.execPromise(file, args, { cwd });
            return { success: true, output: stdout + stderr };
        } catch (error) {
            // Test failed (exit code != 0)
            return { success: false, output: (error.stdout || '') + (error.stderr || error.message || '') };
        }
    }


    /**
     * 🛡️ THE GATE: Validate TDD Cycle
     * @param {string} testCommand - The test command to run
     * @param {string} cwd - Working directory
     * @param {Function} writeCodeFn - Callback to write the code (Agent logic)
     */
    async enforce(testCommand, cwd, writeCodeFn) {
        this.logger.info(`🧪 Step 1: verifying test FAILS first...`);

        // 1. Run Test (Must Fail)
        const initialRun = await this.runTest(testCommand, cwd);
        if (initialRun.success) {
            throw new Error(`[Pariksha] 🛑 TDD VIOLATION: Test passed before code was written! Is it a dummy test?`);
        }
        this.logger.info(`✅ Good. Test failed as expected.`);

        // 2. Write Code (The Agent's "Fix")
        this.logger.info(`✍️ Step 2: Writing implementation...`);
        await writeCodeFn();

        // 3. Run Test Again (Must Pass)
        this.logger.info(`🧪 Step 3: Verifying test PASSES...`);
        const finalRun = await this.runTest(testCommand, cwd);

        if (!finalRun.success) {
            throw new Error(`[Pariksha] ❌ CODE FAILURE: Implementation did not fix the test.\nOutput:\n${finalRun.output}`);
        }

        this.logger.info(`🟢 TDD CYCLE COMPLETE. Code committed.`);
        return true;
    }
}

module.exports = new Pariksha();
module.exports.Pariksha = Pariksha;
