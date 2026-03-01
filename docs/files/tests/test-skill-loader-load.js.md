---
source_hash: 1f088ca56854e163
facts_hash: aded09689a377417
generated_at: 2026-02-25T12:29:33.878Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: tests/test-skill-loader-load.js

## Purpose
This file contains a test suite for the SkillLoader class, which is responsible for loading and managing skills in a specific application. The tests cover various scenarios, including loading valid and invalid skills, filtering by tags, and handling missing directories.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `createSkill` | function | `baseDir, dirName, content, toolsContent` | Creates a new skill with the given name, description, and optional tools. |
| `if` | method | `path === 'gray-matter'` | A conditional statement that checks if the required module is being mocked for testing purposes. |

## Internal Logic
The main execution flow of this file involves setting up a temporary directory, creating skills with different configurations, and then running tests to validate the behavior of the SkillLoader class.

Key functions include:

*   `createSkill`: creates a new skill with the given name, description, and optional tools.
*   The conditional statement `if` is used to check if the required module is being mocked for testing purposes.
*   The `load` method of the SkillLoader class is called multiple times with different parameters to test its behavior.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SkillLoader` | Yes | Provides the main functionality for loading and managing skills. |
| `fs` | No | Provides file system operations, which are used in the creation of skills. |

## Side Effects

-   **console_output**: The console.log statements in the test code may output information about the tests, including any errors or warnings.
-   **filesystem_write**: The `fs.writeFileSync` and `fs.mkdirSync` functions write to files and create directories in the temporary directory, respectively.

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
