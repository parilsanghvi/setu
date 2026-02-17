const { exec } = require('child_process');
const util = require('util');
const defaultExecPromise = util.promisify(exec);

class Pariksha {
    constructor(execPromise) {
        this.execPromise = execPromise || defaultExecPromise;
    }

    /**
     * Run a specific test command
     * @param {string} command - e.g. "npm test tests/my-feature.test.js"
     * @param {string} cwd - Working directory
     * @returns {Promise<{success: boolean, output: string}>}
     */
    async runTest(command, cwd) {
        try {
            const { stdout, stderr } = await this.execPromise(command, { cwd });
            return { success: true, output: stdout + stderr };
        } catch (error) {
            // Test failed (exit code != 0)
            return { success: false, output: error.stdout + error.stderr };
        }
    }

    /**
     * 🛡️ THE GATE: Validate TDD Cycle
     * @param {string} testCommand - The test command to run
     * @param {string} cwd - Working directory
     * @param {Function} writeCodeFn - Callback to write the code (Agent logic)
     */
    async enforce(testCommand, cwd, writeCodeFn) {
        console.log(`[Pariksha] 🧪 Step 1: verifying test FAILS first...`);

        // 1. Run Test (Must Fail)
        const initialRun = await this.runTest(testCommand, cwd);
        if (initialRun.success) {
            throw new Error(`[Pariksha] 🛑 TDD VIOLATION: Test passed before code was written! Is it a dummy test?`);
        }
        console.log(`[Pariksha] ✅ Good. Test failed as expected.`);

        // 2. Write Code (The Agent's "Fix")
        console.log(`[Pariksha] ✍️ Step 2: Writing implementation...`);
        await writeCodeFn();

        // 3. Run Test Again (Must Pass)
        console.log(`[Pariksha] 🧪 Step 3: Verifying test PASSES...`);
        const finalRun = await this.runTest(testCommand, cwd);

        if (!finalRun.success) {
            throw new Error(`[Pariksha] ❌ CODE FAILURE: Implementation did not fix the test.\nOutput:\n${finalRun.output}`);
        }

        console.log(`[Pariksha] 🟢 TDD CYCLE COMPLETE. Code committed.`);
        return true;
    }
}

module.exports = new Pariksha();
module.exports.Pariksha = Pariksha;
