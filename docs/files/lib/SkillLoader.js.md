---
source_hash: 954c1a8430ceb786
facts_hash: 8f5f9ec1361c9ee4
generated_at: 2026-03-03T07:17:07.333Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: lib/SkillLoader.js

## Purpose
This file defines the SkillLoader class, which is responsible for loading and caching skills from a directory structure, filtering by tags, and providing methods to retrieve individual skills.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `load` | function | Loads all skills from the skills directory, optionally filtered by tags. |
| `loadSkill` | function | Loads a specific skill by directory name. |
| `parseSkill` | function | Parses the SKILL.md file using gray-matter for robust frontmatter parsing. |
| `get` | getter function | Returns a specific skill by its name. |
| `getAll` | iterator function | Returns an array of all skills in the cache. |
| `constructor` | constructor function | Initializes the SkillLoader instance with a skills directory path and sets up logging. |

## Internal Logic
The main execution flow of this file starts with the constructor, which initializes the SkillLoader instance with a skills directory path and sets up logging. The load method is then called to populate the cache with skills from the specified directory. The loadSkill method is used to retrieve individual skills by directory name, and the parseSkill method is used to parse the SKILL.md file for each skill.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `Logger` | Yes | Provides logging functionality |
| `fs` | No | Provides filesystem operations |
| `gray-matter` | No | Enables robust frontmatter parsing |

## Side Effects
- The load method triggers afilesystem_read when reading the skills directory and its contents.
- The loadSkill method triggers a filesystem_read when reading the SKILL.md file for each skill.
- The parseSkill method triggers a warning or error message if there is an issue with parsing the frontmatter in the SKILL.md file.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
