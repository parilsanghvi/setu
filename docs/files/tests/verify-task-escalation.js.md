---
source_hash: a473043ec9ba540e
facts_hash: 57f242ce3a85e328
generated_at: 2026-03-04T06:14:28.316Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: tests/verify-task-escalation.js

## Purpose
This file contains tests for task escalation logic in the system, specifically verifying that a task is blocked when it fails three times and that a completed task bypasses the block.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockDatabase` | class | `` | Mocks better-sqlite3 for in-memory database isolation. |
| `bus.updateTask` | function | `taskId, status, meta` | Updates a task with the given status and metadata. |
| `bus.db.prepare` | function | `query` | Prepares a SQL query to execute on the in-memory database. |

## Internal Logic
The main execution flow of this file is as follows:

1. Setup: The file sets up a mock for better-sqlite3 to use an in-memory database and restores the original require method after tests.
2. Load module under test: The file loads the module under test, `bus`, which contains the logic being tested.
3. Define tests:
	* Test 1: Verifies that a task is blocked when it fails three times.
		+ Bus updates the task status to 'TODO', then 'FAILED', and finally triggers an escalation by updating the status again.
		+ The test verifies that the task status changes correctly and that an alert message is sent.
	* Test 2: Verifies that a completed task bypasses the block.
		+ Bus updates the task status to 'DONE' after it has been blocked, verifying that the attempts counter remains the same.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | No | Provides a database module for in-memory isolation. |
| `../lib/db` | Yes | Contains the logic being tested. |

## Side Effects
- console_output: The file tests that an alert message is sent to the console when a task fails three times, and that a warning message is logged if escalation is triggered.
- database: The file uses an in-memory database to test the task escalation logic without affecting the main system database.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
