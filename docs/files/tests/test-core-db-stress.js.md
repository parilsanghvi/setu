---
source_hash: 5bd6bbbcdedd36ac
facts_hash: 308841580b1945c8
generated_at: 2026-03-04T05:57:11.291Z
generator_version: 1.0.0
model: cheap
quality_score: 76
---
# File: tests/test-core-db-stress.js

## Purpose
This file contains two unit tests for the `dbBus` module, testing its ability to handle concurrent writes and event loop interleaving, as well as its resilience in case of missing table errors.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `dbBus.updateTask` | function | `taskName, status, data` | Updates a task with the given name, status, and data. |
| `dbBus.getTasks` | function |  | Retrieves an array of all tasks in the database. |
| `dbBus.heartbeat` | function | `agentName, status, heartbeatId, message` | Sends a heartbeat signal to an agent with the given name and status. |

## Internal Logic
The test file uses two main tests: 'DB Stress: Concurrent Writes & Event Loop Interleaving' and 'DB Resilience: Missing Table Error bubbles up'. The first test creates 1500 tasks and agents using `setImmediate` to simulate concurrent API requests or Agent heartbeats, then checks that all tasks and agents are created. The second test drops the agents table to simulate corruption, attempts to send a heartbeat signal, and verifies that an error is thrown due to the missing table.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `dbBus` | Yes | Provides the core functionality for interacting with the database. |
| `fs` | No | Provides helper utilities such as creating temporary directories. |

## Side Effects
- Database: The tests create and drop tables in the database, and update tasks.
- Filesystem_write: The tests write to the filesystem using `fs.mkdtempSync`, `fs.rmSync`, and other file system methods.
- Subprocess: None

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
