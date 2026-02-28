---
source_hash: 2702a5be81d6c670
facts_hash: 40c56851a0f7d3ad
generated_at: 2026-02-25T12:29:42.135Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-skill-loader.js

## Purpose
This file tests the functionality of the SkillLoader class, ensuring it correctly parses and handles various skill formats, including frontmatter with metadata and gray-matter.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `SkillLoader` | Defines a method to parse skill content. |
| `parseSkill` | Parses skill content from file paths. |

## Internal Logic
The main execution flow of the SkillLoader involves parsing frontmatter metadata, handling gray-matter lists and objects, and extracting relevant information about the skill. The key function in this process is `parseSkill`, which takes a skill name, file path, and content as input.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SkillLoader` | Yes | Provides the SkillLoader class implementation. |
| `fs` | No | Used for file system operations. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
