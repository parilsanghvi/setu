const { fork } = require('child_process');
const path = require('path');

console.log("🧪 Testing Structured Events (Tool Start/End)...");

// Reuse the steering agent as it extends CoreAgent
const agentScript = path.join(__dirname, 'steering-agent.js');
const child = fork(agentScript, [], { stdio: ['inherit', 'pipe', 'pipe', 'ipc'] });

let output = '';

child.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stdout.write(chunk);

    // Check for Tool Events (CoreAgent.speak sends them as messages, but mock agent logs them?)
    // Wait, CoreAgent.speak calls bus.send. 
    // In the test environment, bus is not mocked to print to stdout unless we mock it.
    // CoreAgent requires '../lib/db' which is the bus.
    // In 'steering-agent.js', we import CoreAgent.

    // CoreAgent.js:
    // this.speak(recipient, `Executing ${call.name}`, 'tool_start', ...);

    // Agent.js speak method:
    // speak(recipient, content, type='chat', meta={}) {
    //    bus.send(this.name, recipient, content, type, meta);
    // }

    // lib/db.js (bus) send method:
    // log(...) if type is check.

    // But in the test environment, we are running `steering-agent.js` isolated.
    // Does it use the real `lib/db.js`? Yes.
    // Does `lib/db.js` print to stdout? 
    // It uses `console.log`.

    // So we should see:
    // [SIGNAL] ... tool_start ...
    // or however lib/db.js logs it.

    // Let's check for specific event content.
    if (chunk.includes('tool_start') && chunk.includes('tool_end')) {
        console.log("\n✅ EVENTS VERIFIED: tool_start and tool_end detected.");
        child.kill();
        process.exit(0);
    }
});

// Timeout
setTimeout(() => {
    console.error("\n❌ TIMEOUT: Events not detected.");
    child.kill();
    process.exit(1);
}, 5000);
