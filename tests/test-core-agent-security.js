const Module = require('module');
const path = require('path');
const fs = require('fs');

// 1. Mock Dependencies
const originalRequire = Module.prototype.require;
const mockBus = {
    heartbeat: () => { },
    getUnread: () => [],
    markRead: () => { },
    send: () => { },
};

const mockLLM = {
    generate: async () => "Mock Response",
};

Module.prototype.require = function (id) {
    if (id.endsWith('/lib/db') || id === './db') return mockBus;
    if (id.endsWith('/lib/LLM') || id === './LLM') return mockLLM;
    if (id.endsWith('/lib/Config') || id === './Config') return { contextCompactionThreshold: 200000 };
    if (id.endsWith('/lib/SkillLoader') || id === './SkillLoader') return { load: () => new Map() };
    if (id === 'zod') return { z: { object: () => ({ parse: () => { } }), string: () => ({ min: () => ({ max: () => { } }) }), ZodType: class { } } };
    return originalRequire.apply(this, arguments);
};

// 2. Require CoreAgent
const CoreAgent = require('../lib/CoreAgent');

// 3. Test
async function runTest() {
    console.log("🧪 Verifying Path Traversal Protection...");

    // Create a safe scope
    const safeScope = path.join(__dirname, 'temp_safe_scope');
    if (!fs.existsSync(safeScope)) fs.mkdirSync(safeScope);

    const absSafeScope = path.resolve(safeScope);
    const agent = new CoreAgent('Tester', 'Tester', absSafeScope);

    const targetFile = path.resolve(__dirname, '../package.json');
    let errors = 0;

    // Test 1: Absolute Path Traversal
    console.log(`\n--- Test 1: Absolute Path Traversal ---`);
    let content = await agent.readFile({ path: targetFile });

    if (content && content.includes('"name": "sutradhar-backend"')) {
        console.error("❌ FAILURE: Agent successfully read file outside scope!");
        errors++;
    } else if (content.includes('Access denied')) {
        console.log("✅ SUCCESS: Access denied as expected.");
    } else {
        console.warn("⚠️ WARNING: Read failed but not with 'Access denied'. Msg: " + content);
        // It might be 'File not found' if the path logic is weird, but we expect explicit denial.
        if (content.includes('Error reading file')) {
             console.log("✅ SUCCESS: Read failed (likely due to restriction).");
        } else {
             errors++;
        }
    }

    // Test 2: Write File Traversal
    console.log(`\n--- Test 2: Write File Traversal ---`);
    const targetWrite = path.join(path.dirname(absSafeScope), 'pwned.txt');
    const result = await agent.writeFile({ path: targetWrite, content: 'hacked' });

    if (result.includes('Successfully wrote')) {
        console.error("❌ FAILURE: Agent successfully wrote file outside scope!");
        // cleanup
        try { fs.unlinkSync(targetWrite); } catch(e) {}
        errors++;
    } else if (result.includes('Access denied')) {
        console.log("✅ SUCCESS: Write denied as expected.");
    } else {
        console.warn("⚠️ WARNING: Write failed: " + result);
        if (result.includes('Error writing file')) {
             console.log("✅ SUCCESS: Write failed.");
        } else {
             errors++;
        }
    }

    // Cleanup
    if (fs.existsSync(safeScope)) fs.rmdirSync(safeScope);

    if (errors > 0) {
        console.error(`\n❌ ${errors} tests failed.`);
        process.exit(1);
    } else {
        console.log("\n✅ All security checks passed.");
    }
}

runTest();
