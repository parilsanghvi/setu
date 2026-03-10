const bus = require('../lib/db');
const db = bus.db;

// 1. Simulate Task Completion
const taskId = 'TASK-TEST-DRONA-1';
const taskMeta = {
    budget: 50.0,
    attempts: 3,
    context: "User wanted to fix a CSS bug. I used flexbox."
};

console.log(`[TEST] Creating/Updating Task ${taskId} as DONE...`);
bus.updateTask(taskId, 'DONE', taskMeta);

// 2. Wait and Check for Skill
console.log(`[TEST] Waiting for Drona to meditate...`);

// We can't easily wait for file creation in a synchronous test without polling
// but we can check if Drona received the message by listening to the bus provided we are in the same process
// However, the test script runs separately from the main setu process (usually).
// So we just rely on logs or file system check after a delay.

const fs = require('fs');
const path = require('path');
const skillDir = path.join(__dirname, '../skills/learned');

console.log(`[TEST] Watching ${skillDir} for new skills...`);

let attempts = 0;
const checkInterval = setInterval(() => {
    attempts++;
    if (attempts > 10) {
        console.error('[TEST] ❌ Timeout waiting for skill generation.');
        process.exit(1);
    }

    if (!fs.existsSync(skillDir)) return;

    const files = fs.readdirSync(skillDir);
    if (files.length === 0) return;

    console.log(`[TEST] ✅ Drona generated skills: ${files.join(', ')}`);
    // Verify content of one
    const skillPath = path.join(skillDir, files[0], 'SKILL.md');

    if (fs.existsSync(skillPath)) {
        const content = fs.readFileSync(skillPath, 'utf8');
        console.log(`[TEST] 📜 Skill Content:\n${content.substring(0, 200)}...`);

        if (content.includes('---') && content.includes('name:')) {
            console.log('[TEST] ✅ Frontmatter detected!');
        } else {
            console.error('[TEST] ❌ Frontmatter missing or invalid.');
        }
    }

    clearInterval(checkInterval);
    process.exit(0);
}, 2000);
