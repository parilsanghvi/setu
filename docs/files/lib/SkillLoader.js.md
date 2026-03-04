---
source_hash: 954c1a8430ceb786
facts_hash: 2b8a030d4b93529b
generated_at: 2026-03-04T05:36:58.737Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: lib/SkillLoader.js

## Purpose
This file exports a `SkillLoader` class, which is responsible for loading and caching skills from the skills directory, filtering them by tags, and providing access to individual skill data.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `load` | function | Loads all skills from the skills directory, optionally filtered by tags. |
| `get` | function | Returns a specific skill by name. |
| `getAll` | function | Returns an array of all loaded skills. |
| `SkillLoader` | class | Manages loading and caching of skills. |

## Internal Logic
The main execution flow involves the following key functions:
- `_ensureCache`: Initializes or updates the cache with skills from the skills directory.
- `load`: Loads all skills from the cache, applies filtering by tags, and logs information about the loaded skills.
- `parseSkill`: Parses the frontmatter of a skill's SKILL.md file using gray-matter.
- `loadSkill`: Loads a specific skill by directory name and adds it to the cache.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality. |
| `fs` | No | Enables file system operations. |
| `gray-matter` | No | Facilitates robust frontmatter parsing. |
| `path` | No | Offers path manipulation utilities. |

## Side Effects
- filesystem_read: The `load` and `_ensureCache` methods read the skills directory to populate the cache, which involves file system operations.
- logging: The `Logger` instance is used throughout the class for logging information about loaded skills and errors during loading.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
