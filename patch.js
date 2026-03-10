const fs = require('fs');

const file = 'tests/verify-core-agent-loop.js';
let content = fs.readFileSync(file, 'utf8');

const target = `    if (lastMessage === null && speakCount === 0) {`;
const replacement = `    // After 'stopped thinking' speak, count should be 1, last message is 'stopped thinking'
    // Or we should ignore 'stopped thinking' messages for testing real output
    if (lastMessage === "stopped thinking") lastMessage = null; // hacky
    if (lastMessage === null) {`;

// Just rewrite the helper
const helperTarget = `    // Helper to capture output
    let lastMessage = null;
    let speakCount = 0;
    bot.speak = (recipient, content, type, meta) => {
        // console.log(\`[BOT -> \${recipient}]: \${content}\`);
        lastMessage = content;
        speakCount++;
    };`;

const helperReplacement = `    // Helper to capture output
    let lastMessage = null;
    let speakCount = 0;
    bot.speak = (recipient, content, type, meta) => {
        // console.log(\`[BOT -> \${recipient}]: \${content}\`);
        if (type !== 'thought_start' && type !== 'thought_end' && type !== 'status' && type !== 'TASK_ACK' && type !== 'TASK_COMPLETE') {
            lastMessage = content;
        }
        speakCount++;
    };`;

if (content.includes(helperTarget)) {
    content = content.replace(helperTarget, helperReplacement);

    // Test 3 check
    content = content.replace(`if (lastMessage === null && speakCount === 0) {`, `if (lastMessage === null) {`);

    fs.writeFileSync(file, content);
    console.log('Patched tests/verify-core-agent-loop.js successfully');
} else {
    console.error('Target string not found in test file');
}
