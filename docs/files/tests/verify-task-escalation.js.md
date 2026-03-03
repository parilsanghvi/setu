---
source_hash: a473043ec9ba540e
facts_hash: 6883e9f58129cd1c
generated_at: 2026-03-03T07:55:23.604Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/verify-task-escalation.js

## Purpose
This file contains tests for task escalation functionality in the `bus` module, specifically verifying that tasks are blocked after three failures and that done status bypasses blocking.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockDatabase` | class | `` | Mocks better-sqlite3 to use an in-memory database for isolation. |
| `bus.updateTask` | function | `taskId`, `status`, `data` | Updates a task with the given status and data, incrementing attempts if necessary. |

## Internal Logic
The main execution flow involves setting up a mock database, loading the `db` module under test, defining tests for task escalation, and restoring the original require after tests.

Key functions include:
- `MockDatabase`: A class that mocks better-sqlite3 to use an in-memory database.
- `bus.updateTask`: Updates a task with the given status and data, incrementing attempts if necessary.
- `test('Task Escalation: ...')`: Defines two tests for task escalation functionality.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | No | Provides database functionality. |
| `module` | Yes | Provides require functionality for mocking better-sqlite3. |
| `node:assert` | No | Provides assertion functionality for testing. |

## Side Effects
- console_output:
  - The test verifies that `console.warn` is called with an escalation message, indicating successful task escalation.
- database:
  - The test updates and queries the in-memory database to verify task status and attempt increments.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
