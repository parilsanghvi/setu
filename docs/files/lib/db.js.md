---
source_hash: 8c7d0000748e0474
facts_hash: 6360bcd84deafac6
generated_at: 2026-02-25T12:06:09.148Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/db.js

## Purpose
This file defines a class called `Bus` that serves as the event bus wrapper for the system, handling messaging, task updates, and agent heartbeats.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Bus | cjs_default | Wraps the event bus functionality for the entire system |
| _stmt | function | Prepares a SQL statement for execution |

## Internal Logic
The main execution flow of this file involves initializing the database connection, defining the schema, and creating an instance of the `Bus` class. The key functions include:
- `_stmt`: prepares a SQL statement for execution
- `send`: sends a message and emits an event
- `getUnread`, `getChatHistory`, `markRead`, `heartbeat`, `getDeadAgents`, `updateTask`, `getAgents`, `getTasks`, `getTaskMeta`, and `getNewMessages`: retrieve data from the database or perform operations on it

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| EventEmitter | Yes | Provides event emission functionality |
| better-sqlite3 | No | Manages SQLite database connections |
| fs | No | Handles file system interactions (not used in this code) |
| os | No | Provides operating system-specific utilities (not used in this code) |
| path | No | Generates paths for the database and other files |

## Side Effects
- console_output: The `console.log` statement outputs information to the console when the `LOG_LEVEL` environment variable is set to 'verbose'.
- database: The file creates a SQLite database connection, executes SQL queries, and updates data in the database.
- env_access: The file accesses the `LOG_LEVEL` environment variable to determine whether verbose logging should be enabled.
- filesystem_read: The file does not perform any file system reads (except for creating the database directory, which is done asynchronously).
- filesystem_write: The file creates and writes to files in the database directory.
- network: The file does not establish any network connections or send data over the network.
- subprocess: The file does not create any subprocesses.

## Dependents
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [server.js](./server.js.md)

## Cross-References
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [server.js](./server.js.md)
