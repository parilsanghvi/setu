---
source_hash: 844ee98b70f60e53
facts_hash: 0e794e70dd768cfb
generated_at: 2026-03-04T06:07:49.167Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: tests/test-skill-loader-load.js

## Purpose
This file contains test cases for the SkillLoader class, which is responsible for loading and managing skills in a specific system. The tests cover various scenarios, including loading valid and invalid skills, filtering skills by tag, and handling missing directories.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Module` | function |  | Provides the base module class in Node.js. |
| `path` | function |  | Provides functions for working with file paths in Node.js. |
| `fs` | function |  | Provides functions for interacting with the file system in Node.js. |
| `os` | function |  | Provides functions for interacting with the operating system in Node.js. |
| `assert` | function |  | Provides assertion functions for testing in Node.js. |
| `require` | function |  | Loads modules and returns their exports in Node.js. |

## Internal Logic
The main execution flow of this file is as follows:
- The test suite is initialized using the `test` function from the `node:test` module.
- The SkillLoader class is imported and a new instance is created for each test case.
- A helper function `createSkill` is used to create sample skills with different configurations (e.g., valid, invalid, with tools).
- Each test case creates skills using the `createSkill` function and then uses the SkillLoader instance to load these skills.
- The loaded skills are asserted against expected results, such as their size, presence of specific skills, and content.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SkillLoader` | Yes | Provides the core functionality for loading and managing skills. |
| `fs` | No | Used by the SkillLoader instance to interact with the file system. |

## Side Effects
- console_output: The test suite logs messages to the console using `console.error` and `console.log`.
- filesystem_write: The SkillLoader instance writes files to disk during skill creation and loading, such as skills' Markdown content and tools' JavaScript code.

## Dependents
No known dependents.

## Cross-References
- [SkillLoader.js](../lib/SkillLoader.js.md)
