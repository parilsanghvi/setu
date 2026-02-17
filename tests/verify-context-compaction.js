const path = require('path');
const assert = require('assert');
const CoreAgent = require('../lib/CoreAgent');
const LLM = require('../lib/LLM');

// Mock LLM
LLM.generate = async (system, messages, type) => {
    return "Summary of the conversation.";
};

// Mock SessionLogger to avoid file writes errors
const SessionLogger = require('../lib/SessionLogger');
SessionLogger.prototype.log = () => {};

async function runTest() {
    console.log("🧪 Testing Context Compaction...");

    const agent = new CoreAgent('TestAgent', 'Lead', './');
    agent.sessionLogger = { log: () => {} }; // Mock logger

    // Fill context with dummy data > 800k chars (200k tokens)
    // We need approximately 800k chars.
    const largeMessage = { role: 'user', content: 'a'.repeat(10000) };

    // 81 messages * 10k = 810k chars
    for (let i = 0; i < 85; i++) {
        agent.context.push(largeMessage);
    }

    const initialLength = agent.context.length;
    console.log(`Initial context length: ${initialLength} messages`);

    // Calculate size manually to verify we are over threshold
    const initialSize = JSON.stringify(agent.context).length;
    console.log(`Initial context size: ${initialSize} chars (~${Math.round(initialSize/4)} tokens)`);
    assert(initialSize > 800000, "Context should be larger than 800k chars for test");

    // Run compaction
    await agent.compactContext();

    const finalLength = agent.context.length;
    console.log(`Final context length: ${finalLength} messages`);

    // Verify compaction happened
    // The logic keeps the last 50%
    const expectedLength = Math.ceil(initialLength / 2) + 1; // +1 for summary

    // Wait, the logic is:
    // const cutOffIndex = Math.floor(this.context.length / 2);
    // const toKeep = this.context.slice(cutOffIndex);
    // this.context = [summaryMsg, ...toKeep];
    // initialLength = 85
    // cutOffIndex = 42
    // toKeep length = 85 - 42 = 43
    // final length = 1 + 43 = 44

    console.log(`Expected final length: ${1 + (initialLength - Math.floor(initialLength/2))}`);

    assert(finalLength < initialLength, "Context should be compacted");
    assert(finalLength < 50, "Context should be around half size");

    console.log("✅ Context Compaction Test Passed");
}

runTest().catch(e => {
    console.error("❌ Test Failed:", e);
    process.exit(1);
});
