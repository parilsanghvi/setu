const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Module = require('module');

// Mock require for gray-matter
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path) {
    if (path === 'gray-matter') {
        return function (content) {
            // Simple frontmatter parser for testing
            const lines = content.split('\n');
            const data = {};
            let body = content;

            if (lines[0] && lines[0].trim() === '---') {
                let i = 1;
                while (i < lines.length && lines[i].trim() !== '---') {
                    const line = lines[i];
                    const colonIndex = line.indexOf(':');
                    if (colonIndex !== -1) {
                        const key = line.slice(0, colonIndex).trim();
                        let val = line.slice(colonIndex + 1).trim();

                        // Handle basic array syntax [a, b]
                        if (val.startsWith('[') && val.endsWith(']')) {
                            val = val.slice(1, -1).split(',').map(s => s.trim());
                        }

                        data[key] = val;
                    }
                    i++;
                }
                if (i < lines.length) {
                    body = lines.slice(i + 1).join('\n');
                }
            }
            return { data, content: body };
        };
    }
    return originalRequire.apply(this, arguments);
};

// Now import SkillLoader
const { SkillLoader } = require('../lib/SkillLoader');

// Helper to create a skill
function createSkill(baseDir, dirName, content, toolsContent) {
    const skillDir = path.join(baseDir, dirName);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
    if (toolsContent) {
        fs.writeFileSync(path.join(skillDir, 'tools.js'), toolsContent);
    }
}

test('SkillLoader.load()', async (t) => {
    // Setup temp directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-test-'));
    const loader = new SkillLoader(tempDir);

    // Create Skills

    // Skill A: Valid, tag1
    createSkill(tempDir, 'skill-a', `---
name: skill-a
description: Skill A
tags: tag1
---
# Skill A
`);

    // Skill B: Valid, tag2
    createSkill(tempDir, 'skill-b', `---
name: skill-b
description: Skill B
tags: tag2
---
# Skill B
`);

    // Skill C: Valid, general (implicit or explicit)
    createSkill(tempDir, 'skill-c', `---
name: skill-c
description: Skill C
tags: general
---
# Skill C
`);

    // Skill D: Valid, no tags
    createSkill(tempDir, 'skill-d', `---
name: skill-d
description: Skill D
---
# Skill D
`);

    // Skill E: Invalid (no frontmatter start)
    createSkill(tempDir, 'skill-e', `# Just Markdown`);

    // Skill F: Valid with tools
    createSkill(tempDir, 'skill-f', `---
name: skill-f
description: Skill F
tags: tools
---
# Skill F
`, `
module.exports = [
    {
        name: 'test_tool',
        description: 'A test tool',
        execute: () => 'success'
    }
];
`);

    // Register cleanup
    t.after(() => {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            console.error('Failed to cleanup temp dir:', e);
        }
        // Restore require
        Module.prototype.require = originalRequire;
    });

    await t.test('should load all valid skills when no filter is provided', () => {
        const skills = loader.load(); // No filter
        // A, B, C, D, F are valid. E is invalid.

        assert.strictEqual(skills.size, 5, `Expected 5 skills, got ${skills.size}`);
        assert.ok(skills.has('skill-a'));
        assert.ok(skills.has('skill-b'));
        assert.ok(skills.has('skill-c'));
        assert.ok(skills.has('skill-d'));
        assert.ok(skills.has('skill-f'));
        assert.ok(!skills.has('skill-e'));
    });

    await t.test('should filter skills by tag', () => {
        const skills = loader.load(['tag1']);
        // Should include tag1 (A), general (C), and no-tags (D)
        assert.ok(skills.has('skill-a'), 'skill-a should be present (tag1)');
        assert.ok(skills.has('skill-c'), 'skill-c should be present (general)');
        assert.ok(skills.has('skill-d'), 'skill-d should be present (no tags)');
        assert.strictEqual(skills.has('skill-b'), false, 'skill-b should NOT be present (tag2)');
    });

    await t.test('should load skills with tools', () => {
        const skills = loader.load();
        const skillF = skills.get('skill-f');
        assert.ok(skillF);
        assert.strictEqual(skillF.tools.length, 1);
        assert.strictEqual(skillF.tools[0].name, 'test_tool');
    });

    await t.test('should handle missing directory gracefully', () => {
        const missingDir = path.join(tempDir, 'non-existent');
        const emptyLoader = new SkillLoader(missingDir);

        // Suppress logger.warn for this test
        const originalWarn = emptyLoader.logger.warn;
        let warnCalled = false;
        emptyLoader.logger.warn = (msg, ...args) => {
            if (typeof msg === 'string' && msg.includes('Skills directory not found')) warnCalled = true;
            else originalWarn.call(emptyLoader.logger, msg, ...args);
        };

        try {
            const skills = emptyLoader.load();
            assert.strictEqual(skills.size, 0);
            assert.ok(warnCalled, 'Should verify logger.warn was called');
        } finally {
            emptyLoader.logger.warn = originalWarn;
        }
    });
});
