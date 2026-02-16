const { fork } = require('child_process');
const path = require('path');

console.log("🧪 Testing Steering (Interrupt/Redirect)...");

const agentScript = path.join(__dirname, 'steering-agent.js');
const child = fork(agentScript, [], { stdio: ['inherit', 'pipe', 'pipe', 'ipc'] });

let output = '';

child.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stdout.write(chunk); // Pipe to main console

    // 1. Wait for agent to start loop
    if (chunk.includes('Starting loop...')) {
        setTimeout(() => {
            console.log("\n⚡ SENDING STOP SIGNAL...");
            child.send({ type: 'control', command: 'STOP' });
        }, 2000); // Let it run for 2s (approx 4 turns)
    }

    // 2. Check for Halt
    if (chunk.includes('Execution HALTED') || chunk.includes('Execution INTERRUPTED')) {
        console.log("\n✅ INTERRUPT VERIFIED: Agent halted.");

        // 3. Test Redirect
        setTimeout(() => {
            console.log("\n⚡ SENDING REDIRECT SIGNAL...");
            child.send({ type: 'control', command: 'REDIRECT', payload: "Forget everything. Dance." });
        }, 1000);
    }

    // 4. Check for Redirect
    if (chunk.includes('Redirecting attention') && chunk.includes('Priority Override')) {
        console.log("\n✅ REDIRECT VERIFIED: Agent context updated.");

        // 5. Verify Loop Resumed (New behavior)
        if (chunk.includes('Resuming loop for Redirect') || chunk.includes('Calling LLM')) {
            console.log("\n✅ RESUME VERIFIED: Agent loop continued.");
            console.log("\n🎉 Steering Test Complete.");
            child.kill();
            process.exit(0);
        }
    }
});

child.stderr.on('data', (data) => {
    console.error(`[CHILD ERROR] ${data}`);
});
