const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { SkillLoader } = require('../lib/SkillLoader');

describe('SkillLoader', () => {
    let tempDir;
    let loader;

    before(() => {
        // Create a temporary directory for skills
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-loader-test-'));
        console.log(`Created temp skills dir: ${tempDir}`);

        // Helper to create skill
        const createSkill = (dirName, content, toolsContent) => {
            const skillDir = path.join(tempDir, dirName);
            fs.mkdirSync(skillDir);
            fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
            if (toolsContent) {
                fs.writeFileSync(path.join(skillDir, 'tools.js'), toolsContent);
            }
        };

        // 1. Math Skill (tags: math)
        createSkill('math-skill', `
---
name: MathSkill
description: A skill for math
tags: math
---
Do some math.
`);

        // 2. General Skill (tags: general)
        createSkill('general-skill', `
---
name: GeneralSkill
description: A general skill
tags: general
---
Do general things.
`);

        // 3. Untagged Skill (no tags)
        createSkill('untagged-skill', `
---
name: UntaggedSkill
description: An untagged skill
---
Do untagged things.
`);

        // 4. Cooking Skill (tags: cooking)
        createSkill('cooking-skill', `
---
name: CookingSkill
description: A cooking skill
tags: cooking
---
Cook something.
`);

        // 5. Tool Skill (tags: tools, has tools.js)
        createSkill('tool-skill', `
---
name: ToolSkill
description: A skill with tools
tags: tools
---
Use tools.
`, `
module.exports = [{
    name: 'testTool',
    description: 'A test tool',
    parameters: {}
}];
`);

        // 6. Broken Skill (invalid frontmatter)
        createSkill('broken-skill', `
This is broken.
`);

    });

    after(() => {
        // Cleanup
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            console.log(`Removed temp skills dir: ${tempDir}`);
        }
    });

    test('should initialize with custom directory', () => {
        loader = new SkillLoader(tempDir);
        assert.strictEqual(loader.skillsDir, tempDir);
        assert.strictEqual(loader.skills.size, 0);
    });

    test('load() should load all valid skills', () => {
        const skills = loader.load(); // No filters
        assert.strictEqual(skills.size, 5, 'Should load 5 valid skills');

        assert.ok(skills.has('MathSkill'));
        assert.ok(skills.has('GeneralSkill'));
        assert.ok(skills.has('UntaggedSkill'));
        assert.ok(skills.has('CookingSkill'));
        assert.ok(skills.has('ToolSkill'));

        assert.strictEqual(skills.has('broken-skill'), false);
    });

    test('load() with filters should include matches, general, and untagged', () => {
        // Filter: 'math'
        // Expected: MathSkill (match), GeneralSkill (general), UntaggedSkill (no tags)
        // Excluded: CookingSkill (cooking), ToolSkill (tools)

        const skills = loader.load(['math']);
        assert.strictEqual(skills.size, 3);
        assert.ok(skills.has('MathSkill'));
        assert.ok(skills.has('GeneralSkill'));
        assert.ok(skills.has('UntaggedSkill'));

        assert.strictEqual(skills.has('CookingSkill'), false);
        assert.strictEqual(skills.has('ToolSkill'), false);
    });

    test('load() should correctly parse metadata', () => {
        const mathSkill = loader.get('MathSkill');
        assert.strictEqual(mathSkill.name, 'MathSkill');
        assert.strictEqual(mathSkill.description, 'A skill for math');
        assert.strictEqual(mathSkill.metadata.tags, 'math');
        assert.strictEqual(mathSkill.instructions.trim(), 'Do some math.');
    });

    test('should load tools from tools.js', () => {
        // Reload all to ensure ToolSkill is present
        loader.load();
        const toolSkill = loader.get('ToolSkill');
        assert.ok(toolSkill, 'ToolSkill should be loaded');
        assert.ok(Array.isArray(toolSkill.tools), 'tools should be an array');
        assert.strictEqual(toolSkill.tools.length, 1);
        assert.strictEqual(toolSkill.tools[0].name, 'testTool');
    });

    test('load() with multiple filters', () => {
        // Filter: 'math', 'cooking'
        // Expected: MathSkill, CookingSkill, GeneralSkill, UntaggedSkill
        // Excluded: ToolSkill

        const skills = loader.load(['math', 'cooking']);
        assert.strictEqual(skills.size, 4);
        assert.ok(skills.has('MathSkill'));
        assert.ok(skills.has('CookingSkill'));
    });
});
