const CoreAgent = require('../lib/CoreAgent');
const LLM = require('../lib/LLM');
const bus = require('../lib/db');

// Log bus events for test verification
bus.on('message', (msg) => {
    console.log(`[SIGNAL] ${msg.type}`);
});

// Mock LLM to simulate long running task
LLM.generate = async (prompt, messages, type, tools) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Always return a tool call to keep the loop going
    return {
        toolCalls: [{ name: 'echo', args: { msg: 'Thinking...' } }]
    };
};

class SteeringAgent extends CoreAgent {
    constructor() {
        super('SteeringBot', 'Tester', './');
        this.setTools([{
            name: "echo",
            description: "Echo",
            parameters: { type: "object", properties: { msg: { type: "string" } } }
        }]);
    }

    echo({ msg }) {
        return `Echo: ${msg}`;
    }
}

const bot = new SteeringAgent();

bot.on('tool_start', () => console.log('[SIGNAL] tool_start'));
bot.on('tool_end', () => console.log('[SIGNAL] tool_end'));

// Start the loop
console.log("[SteeringBot] Starting loop...");
bot.processMessage({
    sender: 'User',
    content: 'Start a long task',
    type: 'chat',
    meta: {}
});
