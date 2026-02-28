---
source_hash: 104d48c4db0d12a7
facts_hash: e4968cabdc63cee2
generated_at: 2026-02-25T12:21:11.377Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-contractor.js

## Purpose
This file contains unit tests for the Contractor class, which is responsible for managing tasks and their specifications. It ensures that the Contractor can initialize with a missing file, issue specs, record vetoes, approve tasks, get specifications, and load instances from persistence.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `cleanup` | function | `` | Cleans up test files. |
| `Contractor` | class | `path.to.testFile` | Creates a new Contractor instance, loading or creating a task file. |

## Internal Logic
The main execution flow of this file is as follows:
- The `cleanup` function removes any existing test file to ensure a clean start for each test.
- The tests are run in order, with each test building upon the previous one to ensure that all functionality is working correctly.
- Key functions include:
  - `issueSpec`: Issues a new spec for a task and updates the file accordingly.
  - `recordVeto`: Records a veto for a task and updates the file.
  - `approve`: Approves a task and updates the file.
  - `getSpec`: Retrieves the specification for a task.
- The `Contractor` class:
  - Takes a path to a test file in its constructor, which can be used to load or create a new task file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides synchronous file system utilities. |
| `path` | No | Provides path manipulation utilities. |
| `assert` | Yes | Provides assertion utilities for testing. |

## Side Effects
- console_output: The file logs test status to the console using console.log and console.error.
- filesystem_read: The file reads files from disk using fs.readFileSync, which can potentially block or cause performance issues if used excessively.
- filesystem_write: The file writes data to disk using fs.writeFileSync, which can also potentially block or cause performance issues if used excessively.
- process_control: The file exits the process with a non-zero status code if tests fail, indicating an error.

## Dependents
No known dependents.

## Cross-References
- [Contractor.js](../lib/Contractor.js.md)
