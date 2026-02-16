const CoreAgent = require('../lib/CoreAgent');
const LLM = require('../lib/LLM');
const { z } = require('zod');
const assert = require('assert');

// Mock LLM
LLM.generate = async (system, messages, effort, tools) => {
    // 1. First turn: Call a tool
    if (messages.length === 1) { // User message only
        return {
            toolCalls: [
                { name: 'test_tool', args: { value: 42 } }
            ]
        };
    }

    // 2. Second turn: Respond with text
    return "Test complete.";
};

async function runTest() {
    console.log("🧪 Starting CoreAgent Upgrade Test...");

    const agent = new CoreAgent('TestBot', 'Tester');

    // Define a tool with Zod schema
    const tools = [
        {
            name: 'test_tool',
            description: 'A test tool',
            schema: z.object({
                value: z.number().min(10)
            }),
            parameters: {} // Legacy support (ignored by our Zod logic check)
        }
    ];
    agent.setTools(tools);

    // Mock the tool implementation
    agent.test_tool = async (args) => {
        return `Received value: ${args.value}`;
    };

    // Track Events
    const events = [];
    agent.on('thought_start', (d) => events.push(`thought_start:${d.turn}`));
    agent.on('thought_end', (d) => events.push(`thought_end:${d.turn}`));
    agent.on('tool_start', (d) => events.push(`tool_start:${d.name}`));
    agent.on('tool_end', (d) => events.push(`tool_end:${d.name}`));

    // Validation Test Agent
    const badAgent = new CoreAgent('BadBot', 'Tester');
    badAgent.setTools(tools);

    // Mock LLM to return invalid args
    const originalGenerate = LLM.generate;

    // Test 1: Happy Path (Events)
    await agent.processMessage({ sender: 'User', content: 'Run success test' });

    console.log("Events captured:", events);

    assert.match(events[0], /thought_start:1/);
    assert.match(events[1], /thought_end:1/);
    assert.match(events[2], /tool_start:test_tool/);
    assert.match(events[3], /tool_end:test_tool/);
    // Note: thought_end might be after tool execution in second turn or inside loop? 
    // Wait, my logic in CoreAgent:
    // thought_start -> LLM -> thought_end.
    // If LLM returns tool calls, we execute tool.
    // So order: thought_start -> thought_end -> tool_start -> tool_end.

    // Let's verify actual order in array
    assert.strictEqual(events[0], 'thought_start:1');
    assert.strictEqual(events[1], 'thought_end:1');
    assert.strictEqual(events[2], 'tool_start:test_tool');
    assert.strictEqual(events[3], 'tool_end:test_tool');
    assert.strictEqual(events[4], 'thought_start:2'); // Next turn for final answer

    console.log("✅ Event Flow Verified.");

    // Test 2: validation Failure
    LLM.generate = async () => {
        return {
            toolCalls: [{ name: 'test_tool', args: { value: 5 } }] // 5 < 10 (min)
        };
    };

    const badResult = await badAgent.executeTool({ name: 'test_tool', args: { value: 5 } });
    console.log("Validation Result:", badResult);

    assert.match(badResult, /Tool Argument Validation Failed/);
    console.log("✅ Zod Validation Verified.");

    console.log("🎉 All Tests Passed!");
}

runTest().catch(e => {
    console.error("❌ Test Failed:", e);
    process.exit(1);
});
