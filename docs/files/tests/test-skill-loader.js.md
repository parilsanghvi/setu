---
source_hash: 2702a5be81d6c670
facts_hash: 3d66570b12ed1037
generated_at: 2026-03-04T06:08:00.101Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-skill-loader.js

## Purpose
This file contains unit tests for the SkillLoader class, which is responsible for parsing and validating skill metadata from frontmatter in Markdown files.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `SkillLoader` | Exports the parseSkill function to parse skill metadata. |
| `parseSkill` | Exports a function that takes a name, content, and directory as input and returns an object with parsed skill metadata. |

## Internal Logic
The main execution flow of this file consists of four test cases that cover different scenarios for parsing skill metadata. The test cases verify that the parseSkill function correctly handles simple frontmatter, missing frontmatter, missing name in frontmatter, and complex frontmatter with gray-matter.

The key functions involved are:
- `parseSkill`: This function is responsible for parsing skill metadata from the given content and returns an object with parsed metadata.
- `t.ok()`: This function is used to verify that a condition is met or not. In this case, it's used to check if the parsed result is valid.
- `t.strictEqual()`: This function is used to verify that two values are equal.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SkillLoader` | Yes | Provides the SkillLoader class and its parseSkill method. |
| `node:test` | No | Used for unit testing. |
| `path` | No | Used in the test cases to create directories. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
