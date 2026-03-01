---
source_hash: a473043ec9ba540e
facts_hash: 822cddf8744302ee
generated_at: 2026-02-25T12:34:44.438Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/verify-task-escalation.js

## Purpose
This file contains test cases for the task escalation feature in the system, specifically testing how a task's status changes when it fails and how escalations are triggered.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockDatabase` | class | `` | Mocks better-sqlite3 for in-memory database isolation. |
| `require` | function | `id` | Loads a module and returns its exported value. |

## Internal Logic
The main execution flow of this file is as follows:

1. It sets up a mock for better-sqlite3 to use an in-memory database for isolation.
2. It loads the `db` module, which contains the bus class under test.
3. It defines two test cases:
	* The first test case tests how task escalation works when a task fails three times.
	* The second test case tests how the "DONE" status bypasses the block feature.
4. In each test case, it updates the task's status using the `updateTask` method and verifies that the task's metadata is updated correctly.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides a testing framework for writing unit tests. |
| `better-sqlite3` | No | Provides a SQL database abstraction layer. |

## Side Effects
- console_output: The test cases verify that the console.warn method is called with an escalation message when a task fails three times.
- database: The test cases update and query the in-memory database to verify the correctness of the task's metadata and status changes.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
