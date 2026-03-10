const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { z } = require('zod');
const AgentToolExecutor = require('../lib/AgentToolExecutor');

test('AgentToolExecutor Tests', async (t) => {

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-tool-executor-test-'));
    const safeScope = path.resolve(tempDir);

    t.after(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    await t.test('executeTool functionality', async () => {

        const mockAgent = {
            logger: { info: () => {} },
            tools: [
                {
                    name: 'dynamic_tool',
                    parameters: true,
                    schema: z.object({ value: z.string() }),
                    execute: async (args) => `Dynamic Result: ${args.value}`
                },
                {
                    name: 'handler_tool',
                    handler: async (args) => `Handler Result`
                },
                {
                    name: 'broken_tool',
                    execute: async () => { throw new Error('Broken!'); }
                }
            ],
            scope: safeScope,
            internal_method: async (args) => `Internal: ${args.val}`
        };

        const executor = new AgentToolExecutor(mockAgent);

        // Test 1: Validation failure
        const resultValidationFail = await executor.executeTool({ name: 'dynamic_tool', args: { value: 123 } });
        assert.ok(resultValidationFail.includes('Validation Failed'));

        // Test 2: Dynamic tool execution (execute)
        const resultDynamic = await executor.executeTool({ name: 'dynamic_tool', args: { value: 'test' } });
        assert.strictEqual(resultDynamic, 'Dynamic Result: test');

        // Test 3: Dynamic tool execution (handler)
        const resultHandler = await executor.executeTool({ name: 'handler_tool', args: {} });
        assert.strictEqual(resultHandler, 'Handler Result');

        // Test 4: Broken dynamic tool
        const resultBroken = await executor.executeTool({ name: 'broken_tool', args: {} });
        assert.ok(resultBroken.includes('Error executing skill tool'));

        // Test 5: Internal method execution
        const resultInternal = await executor.executeTool({ name: 'internal_method', args: { val: 'yes' } });
        assert.strictEqual(resultInternal, 'Internal: yes');

        // Test 6: Broken internal method
        mockAgent.broken_internal = async () => { throw new Error('Internal Broken!'); };
        const resultBrokenInternal = await executor.executeTool({ name: 'broken_internal', args: {} });
        assert.ok(resultBrokenInternal.includes('Error executing internal method'));

        // Test 7: Unknown tool
        const resultUnknown = await executor.executeTool({ name: 'unknown_tool', args: {} });
        assert.strictEqual(resultUnknown, 'Unknown tool: unknown_tool');

        // Test 8: _resolvePath
        const resolved = executor._resolvePath('test.txt');
        assert.strictEqual(resolved, path.join(safeScope, 'test.txt'));

        assert.throws(() => executor._resolvePath('../out.txt'), /Access denied/);
        assert.throws(() => executor._resolvePath('/etc/passwd'), /Access denied/);
        assert.throws(() => executor._resolvePath(''), /File path is required/);

        // Test 9: Write File
        const writeResult = await executor.executeTool({ name: 'write_file', args: { path: 'test.txt', content: 'hello world' } });
        assert.ok(writeResult.includes('Successfully wrote'));
        assert.strictEqual(fs.readFileSync(path.join(safeScope, 'test.txt'), 'utf8'), 'hello world');

        // Test 10: Read File
        const readResult = await executor.executeTool({ name: 'read_file', args: { path: 'test.txt' } });
        assert.strictEqual(readResult, 'hello world');

        // Test 11: Read non-existent file
        const readMissing = await executor.executeTool({ name: 'read_file', args: { path: 'missing.txt' } });
        assert.ok(readMissing.includes('File not found'));

        // Test 12: Write File Traversal
        const writeTraversal = await executor.executeTool({ name: 'write_file', args: { path: '../out.txt', content: 'hacked' } });
        assert.ok(writeTraversal.includes('Access denied') || writeTraversal.includes('outside the allowed scope'));

        // Test 13: Read File Traversal
        const readTraversal = await executor.executeTool({ name: 'read_file', args: { path: '../out.txt' } });
        assert.ok(readTraversal.includes('Access denied') || readTraversal.includes('outside the allowed scope'));

        // Test 14: Read Symlink Escaping Scope
        const outsideFile = path.join(os.tmpdir(), 'outside-test.txt');
        fs.writeFileSync(outsideFile, 'secret');
        const symlinkPath = path.join(safeScope, 'symlink.txt');
        try {
            fs.symlinkSync(outsideFile, symlinkPath);
            const readSymlink = await executor.executeTool({ name: 'read_file', args: { path: 'symlink.txt' } });
            assert.ok(readSymlink.includes('Access denied') || readSymlink.includes('escapes scope'));
        } finally {
            if(fs.existsSync(outsideFile)) fs.rmSync(outsideFile);
        }
    });
});
