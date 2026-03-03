---
source_hash: 104d48c4db0d12a7
facts_hash: 904fd80847858fe4
generated_at: 2026-03-03T07:36:32.869Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-contractor.js

## Purpose
This file tests the functionality of the `Contractor` class, which is responsible for managing tasks and their specifications. The `Contractor` class is used to initialize and manipulate tasks, including creating new task entries, recording vetoes, approving tasks, and retrieving specifications.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `issueSpec` | function | `taskId`, `domain`, `spec` | Issues a new task specification for the given task ID. |
| `recordVeto` | function | `taskId`, `agent`, `reason` | Records a veto for the specified task. |
| `approve` | function | `taskId` | Approves the specified task. |
| `getSpec` | function | `taskId` | Retrieves the specification for the given task ID. |
| `Constructor` | class | `` | Initializes and manages tasks. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `Contractor` class is initialized with a test file path.
2. A series of tests are run to verify the functionality of the `issueSpec`, `recordVeto`, `approve`, and `getSpec` methods.
3. After each test, the state of the task entries is verified by reading the contents of the test file.
4. If all tests pass, a success message is printed; otherwise, an error message is printed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Contractor` | Yes | Provides the `Contractor` class implementation. |
| `assert` | No | Provides assertion utilities for testing. |
| `fs` | No | Provides file system utilities for reading and writing files. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The file prints success or failure messages to the console.
- filesystem_read: The file reads the contents of the test file to verify task entries.
- filesystem_write: The file writes new task entries and vetoes to the test file during testing.
- process_control: The file exits with a non-zero status code if an error occurs, indicating failure.

## Dependents
No known dependents.

## Cross-References
- [Contractor.js](../lib/Contractor.js.md)
