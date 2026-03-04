---
source_hash: 104d48c4db0d12a7
facts_hash: 79fb3c7cebf1c72b
generated_at: 2026-03-04T05:55:44.109Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-contractor.js

## Purpose
This file contains unit tests for the Contractor class, which is responsible for managing tasks and their specifications in a test data store. The tests verify that the Contractor class correctly initializes with an empty contract object, creates new contracts using issueSpec, records vetoes, approves tasks, retrieves task specifications, and persists between instances.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Contractor` | function | `` | Creates a new Contractor instance with an empty contract object. |
| `issueSpec` | function | `taskId`, `domain`, `spec` | Creates a new task specification and adds it to the contract object. |
| `recordVeto` | function | `taskId`, `agent`, `reason` | Records a veto on a task and updates its status in the contract object. |
| `approve` | function | `taskId` | Approves a task by updating its status in the contract object. |
| `getSpec` | function | `taskId` | Retrieves the current specification of a task from the contract object. |

## Internal Logic
The test file executes in the following main execution flow:
1. It cleans up any existing test data file.
2. It creates a new Contractor instance with an empty contract object and verifies that it loads correctly.
3. It tests various methods of the Contractor class, including issueSpec, recordVeto, approve, and getSpec.
4. For each method, it verifies that the expected behavior occurs by reading and comparing the contents of the test data file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Contractor` | Yes | Provides the Contractor class implementation. |
| `assert` | No | Provides assertion utilities for verifying test results. |
| `fs` | No | Provides file system utility functions, including reading and writing files. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The test file logs various messages to the console using console.log and console.error.
- filesystem_read: The test file reads the contents of the test data file using fs.readFileSync.
- filesystem_write: The test file writes new content to the test data file using fs.writeFileSync.
- process_control: The test file exits the process with a non-zero status code if tests fail, and otherwise continues executing.

## Dependents
No known dependents.

## Cross-References
- [Contractor.js](../lib/Contractor.js.md)
