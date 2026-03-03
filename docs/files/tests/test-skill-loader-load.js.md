---
source_hash: 844ee98b70f60e53
facts_hash: 0397a7572270d0a5
generated_at: 2026-03-03T07:47:37.554Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: tests/test-skill-loader-load.js

## Purpose
This file tests the functionality of the `SkillLoader` class, specifically its ability to load and filter skills from a directory.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| SkillLoader | function |  | Instantiates a new SkillLoader instance. |
| createSkill | function | `baseDir, dirName, content, toolsContent` | Creates a new skill in the specified directory. |
| load | method | `[filter]` | Loads skills from the directory with optional filtering by tag. |

## Internal Logic
The main execution flow involves creating a temporary directory for testing, instantiating a `SkillLoader` instance, and then loading and filtering skills using its `load()` method.

Key functions include:

- `createSkill()`: creates a new skill in the specified directory.
- `if`: checks if the path is 'gray-matter' to mock the original require function.

The `load()` method iterates over all files in the directory, extracts frontmatter data from each file, and adds it to an internal data structure. The method then filters the skills based on the provided filter (if any) and returns a list of valid skills.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| SkillLoader | Yes | Provides the class being tested. |
| fs | No | Used for creating directories and writing files. |
| module | No | Provides the original require function. |

## Side Effects
- console_output: The test script logs output to the console, including error messages.
- filesystem_write: The `fs.writeFileSync()` method is used to write content to files in the temporary directory.

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
