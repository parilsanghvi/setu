const { test, describe, before, after } = require('node:test');
const assert = require('assert');
const path = require('path');
const fs = require('fs/promises');
const { z } = require('zod');
const AgentToolExecutor = require('./AgentToolExecutor');

describe('AgentToolExecutor', () => {
    let executor;
    let mockAgent;
    const testScope = path.join(__dirname, 'temp_test_scope');

    before(async () => {
        await fs.mkdir(testScope, { recursive: true });

        mockAgent = {
            logger: {
                info: () => {}
            },
            scope: testScope,
            tools: [],
            internalMethod: async (args) => `Internal: ${args.msg}`,
            failingMethod: async () => { throw new Error('Internal fail'); }
        };
        executor = new AgentToolExecutor(mockAgent);
    });

    after(async () => {
        await fs.rm(testScope, { recursive: true, force: true });
    });

    test('Unknown tool', async () => {
        const result = await executor.executeTool({ name: 'unknown', args: {} });
        assert.strictEqual(result, 'Unknown tool: unknown');
    });

    test('Schema validation - success', async () => {
        mockAgent.tools = [{
            name: 'test_tool',
            parameters: {},
            schema: z.object({ msg: z.string() }),
            execute: async (args) => `Executed: ${args.msg}`
        }];
        const result = await executor.executeTool({ name: 'test_tool', args: { msg: 'hello' } });
        assert.strictEqual(result, 'Executed: hello');
    });

    test('Schema validation - failure', async () => {
        mockAgent.tools = [{
            name: 'test_tool',
            parameters: {},
            schema: z.object({ msg: z.string() }),
            execute: async () => 'Should not run'
        }];
        const result = await executor.executeTool({ name: 'test_tool', args: { msg: 123 } });
        assert.match(result, /Tool Argument Validation Failed/);
    });

    test('Dynamic Tool Execution - handler', async () => {
        mockAgent.tools = [{
            name: 'handler_tool',
            handler: async (args, agent) => {
                assert.strictEqual(agent, mockAgent);
                return 'Handled';
            }
        }];
        const result = await executor.executeTool({ name: 'handler_tool', args: {} });
        assert.strictEqual(result, 'Handled');
    });

    test('Dynamic Tool Execution - error', async () => {
        mockAgent.tools = [{
            name: 'error_tool',
            execute: async () => { throw new Error('Tool fail'); }
        }];
        const result = await executor.executeTool({ name: 'error_tool', args: {} });
        assert.match(result, /Error executing skill tool error_tool: Tool fail/);
    });

    test('Internal Method Execution - success', async () => {
        const result = await executor.executeTool({ name: 'internalMethod', args: { msg: 'test' } });
        assert.strictEqual(result, 'Internal: test');
    });

    test('Internal Method Execution - error', async () => {
        const result = await executor.executeTool({ name: 'failingMethod', args: {} });
        assert.match(result, /Error executing internal method failingMethod: Internal fail/);
    });

    test('Built-in writeFile and readFile', async () => {
        const writeResult = await executor.executeTool({
            name: 'write_file',
            args: { path: 'test.txt', content: 'hello world' }
        });
        assert.strictEqual(writeResult, 'Successfully wrote to test.txt');

        const readResult = await executor.executeTool({
            name: 'read_file',
            args: { path: 'test.txt' }
        });
        assert.strictEqual(readResult, 'hello world');
    });

    test('Built-in readFile - not found', async () => {
        const result = await executor.executeTool({
            name: 'read_file',
            args: { path: 'nonexistent.txt' }
        });
        assert.strictEqual(result, 'Error: File not found at nonexistent.txt');
    });

    test('Path validation - outside scope error', async () => {
        const result = await executor.executeTool({
            name: 'write_file',
            args: { path: '../outside.txt', content: 'bad' }
        });
        assert.match(result, /Access denied: Path is outside the allowed scope/);
    });
});
