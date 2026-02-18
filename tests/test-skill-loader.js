const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const SkillLoader = require('../lib/SkillLoader');

test('SkillLoader should parse simple frontmatter correctly', async (t) => {
    const mockContent = `---
name: test-skill
description: A test skill
tags: test, unit
---
# Test Skill

This is a test skill.
`;
    const parsed = SkillLoader.parseSkill('test-skill', mockContent, '/tmp/test-skill');

    assert.ok(parsed, 'Should parse valid content');
    assert.strictEqual(parsed.name, 'test-skill');
    assert.strictEqual(parsed.description, 'A test skill');
    assert.strictEqual(parsed.metadata.tags, 'test, unit');
    assert.ok(parsed.instructions.includes('# Test Skill'), 'Should contain markdown content');
});

test('SkillLoader should handle missing frontmatter', async (t) => {
    const mockContent = `# Just Markdown

No frontmatter here.
`;
    const parsed = SkillLoader.parseSkill('no-frontmatter', mockContent, '/tmp/no-frontmatter');
    assert.strictEqual(parsed, null, 'Should return null for missing frontmatter');
});

test('SkillLoader should handle missing name in frontmatter', async (t) => {
    const mockContent = `---
description: No name provided
---
# Invalid Skill
`;
    const parsed = SkillLoader.parseSkill('no-name', mockContent, '/tmp/no-name');
    assert.strictEqual(parsed, null, 'Should return null when name is missing');
});

test('SkillLoader should handle complex frontmatter with gray-matter', async (t) => {
    const mockContent = `---
name: complex-skill
description: "A description with colons: and special characters"
tags:
  - complex
  - parsing
nested:
  key: value
---
# Complex Skill
`;
    const parsed = SkillLoader.parseSkill('complex-skill', mockContent, '/tmp/complex-skill');

    assert.ok(parsed, 'Should parse complex content');
    assert.strictEqual(parsed.name, 'complex-skill');
    assert.strictEqual(parsed.description, 'A description with colons: and special characters');
    // gray-matter parses list as array
    assert.deepStrictEqual(parsed.metadata.tags, ['complex', 'parsing']);
    // gray-matter parses nested object
    assert.deepStrictEqual(parsed.metadata.nested, { key: 'value' });
});
