---
source_hash: 7ffb3f652aa89ab5
facts_hash: 2b7ed22fbc55d934
generated_at: 2026-03-03T07:39:07.418Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: tests/test-db.js

## Purpose
This file contains tests for the `Bus` class, which is responsible for managing chat messages and agents in a distributed system.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `bus` | object | `` | Provides methods to manage chat messages |
| `getUnread` | function | `id` | Returns unread messages for a user |
| `markRead` | function | `[msgId]` | Marks messages as read |
| `getChatHistory` | function | `(user1, user2, limit)` | Returns chat history between two users with optional limit |
| `updateTask` | function | `(taskId, status, data)` | Updates task status and metadata |
| `getTasks` | function | `` | Returns a list of tasks |
| `getTaskMeta` | function | `` | Returns task count and maximum updated_at timestamp |
| `heartbeat` | function | `(name, role, pid, status)` | Inserts or updates an agent's heartbeat data |

## Internal Logic
The main execution flow of this file is to set up a mock database using better-sqlite3, load the Bus class, define tests for various scenarios, and run the tests using the node:test module.

Key functions include `send`, which simulates sending a chat message between two users; `getUnread` and `markRead`, which manage unread messages; `getChatHistory`, which returns chat history between two users; `updateTask`, which updates task status and metadata; and `heartbeat`, which inserts or updates an agent's heartbeat data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | Yes | Provides a testing framework |
| `../lib/db` | Yes | Loads the Bus class with database functionality |
| `better-sqlite3` | No | Used for mocking a SQLite database |

## Side Effects
- database: The tests modify the in-memory database used by the mock better-sqlite3 module.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
