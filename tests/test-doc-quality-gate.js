#!/usr/bin/env node
/**
 * Unit tests for the S-Tier Documentation System.
 *
 * Tests:
 * - isDocPopulated()
 * - scoreDocQuality()
 * - Placeholder detection
 * - Fingerprint skip behavior
 * - Fact extraction (symbols, imports, exports, side effects)
 * - Secret redaction
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const { isDocPopulated, scoreDocQuality, getRepoQuality, PLACEHOLDER_MARKERS } = require('../lib/onboarding/status');
const { extractFacts, extractSymbols, extractImports, extractExports, extractSideEffects, hashContent } = require('../lib/onboarding/doc-facts');
const { isPlaceholderDoc, redactSecrets, parseFrontmatter, buildFrontmatter, scoreDocContent } = require('../lib/onboarding/doc-enricher');

let passed = 0;
let failed = 0;

function assert(condition, name) {
    if (condition) {
        passed++;
        console.log(`  ✅ ${name}`);
    } else {
        failed++;
        console.error(`  ❌ ${name}`);
    }
}

function createTempFile(content) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setu-test-'));
    const tmpFile = path.join(tmpDir, 'test.md');
    fs.writeFileSync(tmpFile, content);
    return { tmpDir, tmpFile };
}

function cleanup(tmpDir) {
    try { fs.rmSync(tmpDir, { recursive: true }); } catch (_) { }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

console.log('\n🧪 Test Suite: isDocPopulated()\n');

(() => {
    // Test: placeholder file returns false
    const { tmpDir, tmpFile } = createTempFile('# File: test.js\n\n**Purpose:** [What does this file do?]\n\n**Key Exports:**\n- [List functions/classes export]\n');
    assert(!isDocPopulated(tmpFile), 'Placeholder file returns false');
    cleanup(tmpDir);
})();

(() => {
    // Test: empty file returns false
    const { tmpDir, tmpFile } = createTempFile('');
    assert(!isDocPopulated(tmpFile), 'Empty file returns false');
    cleanup(tmpDir);
})();

(() => {
    // Test: short file returns false
    const { tmpDir, tmpFile } = createTempFile('# File: test.js\n\nThis is short.\n');
    assert(!isDocPopulated(tmpFile), 'Short file (<300 chars) returns false');
    cleanup(tmpDir);
})();

(() => {
    // Test: rich doc returns true
    const content = `---
source_hash: abc123
generated_at: 2026-01-01
generator_version: 1.0.0
model: cheap
quality_score: 85
facts_hash: def456
---
# File: lib/CoreAgent.js

## Purpose
CoreAgent is the LLM-powered agent runtime that handles tool execution, context memory management, and the TASK_ASSIGN/TASK_COMPLETE protocol loop. It is the heart of every persona agent.

## Exports / API Surface
| Export | Type | Signature | Description |
|--------|------|-----------|-------------|
| \`CoreAgent\` | class | \`new CoreAgent(name, systemPrompt)\` | Creates a new agent instance |

## Dependencies
| Module | Why |
|--------|-----|
| \`./db.js\` | Event bus for message send/receive |
| \`./LLM.js\` | LLM generation calls |

## Dependents
- [Sutradhar.js](../agents/Sutradhar.js.md)
- [Tark.js](../agents/Tark.js.md)
- [Shilpi.js](../agents/Shilpi.js.md)

## Side Effects
- Writes to database via bus.send()
- Reads/writes session log files
- Makes network calls to LLM providers

## Cross-References
- See [db.js](./db.js.md) for event bus implementation
- See [LLM.js](./LLM.js.md) for model routing
- See [Agent.js](./Agent.js.md) for lightweight wrapper
`;
    const { tmpDir, tmpFile } = createTempFile(content);
    assert(isDocPopulated(tmpFile), 'Rich populated doc returns true');
    cleanup(tmpDir);
})();

(() => {
    // Test: PLACEHOLDER marker
    const { tmpDir, tmpFile } = createTempFile('<!-- PLACEHOLDER -->\n# File: test.js\n\nSome content here that is long enough.\n' + 'x'.repeat(400));
    assert(!isDocPopulated(tmpFile), 'File with <!-- PLACEHOLDER --> marker returns false');
    cleanup(tmpDir);
})();

(() => {
    // Test: non-existent file
    assert(!isDocPopulated('/tmp/nonexistent-setu-test-file.md'), 'Non-existent file returns false');
})();


console.log('\n🧪 Test Suite: scoreDocQuality()\n');

(() => {
    const content = `---
source_hash: abc
facts_hash: def
generated_at: 2026-01-01
generator_version: 1.0.0
model: cheap
quality_score: 0
---
# File: lib/db.js

## Purpose
Database layer providing SQLite-backed event bus for Setu agent communication.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| \`send\` | function | Send a message to the bus |
| \`getMessages\` | function | Retrieve messages since ID |

## Dependencies
| Module | Why |
|--------|-----|
| \`better-sqlite3\` | SQLite driver |

## Side Effects
- Creates/opens SQLite database at ~/.setu/setu.db
- WAL mode enabled on initialization

## Cross-References
- See [CoreAgent.js](./CoreAgent.js.md) for primary consumer
- See [index.js](../index.js.md) for kernel usage
- See [server.js](./server.js.md) for API layer
`;
    const { tmpDir, tmpFile } = createTempFile(content);
    const score = scoreDocQuality(tmpFile, 'file');
    assert(score.populated === true, 'Populated doc scores as populated');
    assert(score.total_score > 50, `Score > 50 (got ${score.total_score})`);
    assert(score.structure_score > 0, 'Structure score > 0');
    assert(score.factuality_score > 0, 'Factuality score > 0');
    assert(score.crossref_score > 0, 'Cross-ref score > 0');
    cleanup(tmpDir);
})();

(() => {
    const { tmpDir, tmpFile } = createTempFile('# File: test.js\n\n**Purpose:** [What does this file do?]\n');
    const score = scoreDocQuality(tmpFile, 'file');
    assert(score.populated === false, 'Placeholder doc scores as not populated');
    assert(score.total_score === 0, 'Placeholder doc has score 0');
    cleanup(tmpDir);
})();


console.log('\n🧪 Test Suite: extractSymbols()\n');

(() => {
    const code = `
function hello(name) { return name; }
const add = (a, b) => a + b;
class Agent extends CoreAgent {
  async run(task) { }
}
`;
    const symbols = extractSymbols(code);
    const names = symbols.map(s => s.name);
    assert(names.includes('hello'), 'Extracts named function');
    assert(names.includes('add'), 'Extracts arrow function');
    assert(names.includes('Agent'), 'Extracts class');
    assert(names.includes('run'), 'Extracts class method');
})();


console.log('\n🧪 Test Suite: extractExports()\n');

(() => {
    const code = `
module.exports = { hello, world };
exports.extra = 42;
`;
    const exports = extractExports(code);
    const names = exports.map(e => e.name);
    assert(names.includes('hello'), 'Extracts CJS named export: hello');
    assert(names.includes('world'), 'Extracts CJS named export: world');
    assert(names.includes('extra'), 'Extracts CJS property export: extra');
})();


console.log('\n🧪 Test Suite: extractSideEffects()\n');

(() => {
    const code = `
fs.writeFileSync('foo', 'bar');
const data = fs.readFileSync('baz');
fetch('https://api.example.com');
process.env.FOO;
db.prepare('SELECT * FROM agents').all();
`;
    const effects = extractSideEffects(code);
    assert(effects.includes('filesystem_write'), 'Detects filesystem write');
    assert(effects.includes('filesystem_read'), 'Detects filesystem read');
    assert(effects.includes('network'), 'Detects network call');
    assert(effects.includes('env_access'), 'Detects env access');
    assert(effects.includes('database'), 'Detects database operation');
})();


console.log('\n🧪 Test Suite: redactSecrets()\n');

(() => {
    const input = `const apiKey = "sk-1234567890abcdef1234567890abcdef";`;
    const { text, redactionCount } = redactSecrets(input);
    assert(redactionCount > 0, 'Redacts secret patterns');
    assert(!text.includes('sk-1234567890abcdef'), 'Secret value is removed from output');
    assert(text.includes('REDACTED'), 'Redaction marker is inserted');
})();

(() => {
    const input = `const name = "hello world";`;
    const { text, redactionCount } = redactSecrets(input);
    assert(redactionCount === 0, 'Safe content has no redactions');
    assert(text === input, 'Safe content is unchanged');
})();


console.log('\n🧪 Test Suite: parseFrontmatter()\n');

(() => {
    const content = `---
source_hash: abc123
generated_at: 2026-01-01
generator_version: 1.0.0
model: cheap
quality_score: 85
facts_hash: def456
---
# File: test.js`;
    const meta = parseFrontmatter(content);
    assert(meta !== null, 'Parses frontmatter successfully');
    assert(meta.source_hash === 'abc123', 'Extracts source_hash');
    assert(meta.quality_score === '85', 'Extracts quality_score');
})();

(() => {
    const content = `# File: test.js\nNo frontmatter here.`;
    const meta = parseFrontmatter(content);
    assert(meta === null, 'Returns null for no frontmatter');
})();


console.log('\n🧪 Test Suite: isPlaceholderDoc() (enricher version)\n');

(() => {
    assert(isPlaceholderDoc('# File\n\n**Purpose:** [What does this file do?]\n'), 'Detects file placeholder');
    assert(isPlaceholderDoc('<!-- PLACEHOLDER -->\n# stuff\n'), 'Detects PLACEHOLDER marker');
    assert(isPlaceholderDoc('# Folder\n\n[Describe what this folder contains and its role]\n'), 'Detects folder placeholder');
    assert(!isPlaceholderDoc('# File: test.js\n\nThis is a real description of what the file does.\n'), 'Non-placeholder passes');
})();


// ─── Summary ────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'─'.repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
