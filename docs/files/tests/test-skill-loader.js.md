---
source_hash: 2702a5be81d6c670
facts_hash: 3ca0680582d0f707
generated_at: 2026-03-03T07:47:49.054Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-skill-loader.js

## Purpose
This file contains unit tests for the SkillLoader class, which is responsible for parsing skill metadata from frontmatter in Markdown files. The test suite verifies that the SkillLoader correctly handles various scenarios, including simple and complex frontmatter, missing metadata, and invalid input.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `SkillLoader` | Provides a method to parse skill metadata from frontmatter. |

## Internal Logic
The main execution flow of the test file involves running each test case using the node:test framework. The SkillLoader class is instantiated and its methods are called with sample input data.

Key functions:

- `parseSkill`: Takes three arguments (skill name, content, and output directory) and returns an object containing the parsed skill metadata.
- `parseFrontmatter`: Parses frontmatter from a given string and returns an object containing the extracted metadata.
- `grayMatter`: A helper function that parses gray-matter lists and nested objects.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SkillLoader` | Yes | Implements the SkillLoader class |
| `node:assert` | No | Provides assertion utilities for testing |
| `path` | No | Used by the fs module |

## Side Effects

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
