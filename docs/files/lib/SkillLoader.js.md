---
source_hash: 1606fcd192552ee6
facts_hash: ba1d7e42e63dc605
generated_at: 2026-02-25T12:04:43.203Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/SkillLoader.js

## Purpose
The SkillLoader.js file is responsible for loading and caching skills from a directory, filtering them by tags, and providing access to individual skills. It uses the gray-matter library for parsing frontmatter in skill files and includes tools module dependencies. The class provides methods for loading all or specific skills.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `load` | function | Loads all skills from the skills directory, optionally filtered by tags. |
| `getAll` | function | Returns an array of all loaded skills. |
| `get` | function | Retrieves a skill by name from the cache. |
| `loader` | cjs_default | A default export of the SkillLoader class. |

## Internal Logic
The main execution flow involves:

* The constructor initializing the skills directory, cache, and loading the initial skills.
* The `_ensureCache` method reading the skills directory contents and populating the cache with skill metadata.
* The `load` method filtering the skills based on tags and updating the cache.
* The `parseSkill` method parsing frontmatter in a skill file and extracting its metadata.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system functionality. |
| `gray-matter` | No | Enables robust frontmatter parsing. |
| `path` | No | Helps with file system path manipulation. |

## Side Effects

* console_output: The class logs messages to the console during its execution, such as successful skill loading and filtering results.
* filesystem_read: The class reads files from the skills directory to load initial skills and individual skills using fs.existsSync() and fs.readFileSync().

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
