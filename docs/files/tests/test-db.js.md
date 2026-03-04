---
source_hash: 7ffb3f652aa89ab5
facts_hash: 1a210d418e355490
generated_at: 2026-03-04T05:59:15.748Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-db.js

## Purpose
This file tests the functionality of a message bus, specifically its ability to send and receive messages, mark messages as read, retrieve chat history, update tasks, and handle agent heartbeats.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `bus` | function | `sender, receiver, content, type` | Sends a message from the sender to the receiver with the given content. |
| `getUnread` | method | `receiver` | Returns an array of unread messages for the given receiver. |
| `markRead` | method | `[messageId]` | Marks one or more messages as read. |
| `getChatHistory` | method | `sender, receiver, limit` | Returns a list of chat history events from the sender to the receiver up to the specified limit. |
| `updateTask` | method | `taskId, status, data` | Updates the task with the given ID and new status, as well as optional data. |
| `getTasks` | method | `` | Retrieves an array of tasks. |
| `getTaskMeta` | method | `` | Returns metadata about the current task, including its count and maximum updated_at value. |
| `heartbeat` | method | `agentName, role, pid, status` | Registers or updates an agent with the given name, role, process ID, and status. |
| `getDeadAgents` | method | `timeout` | Returns a list of dead agents within the specified timeout period. |

## Internal Logic
The main execution flow involves setting up a mock database for better-sqlite3 to use in-memory, loading the message bus module under test, defining various tests to cover different scenarios, and executing each test using the node:test framework.

Key functions include:
- `bus.send`: Sends a message from the sender to the receiver with the given content.
- `bus.getUnread`: Returns an array of unread messages for the given receiver.
- `bus.markRead`: Marks one or more messages as read.
- `bus.getChatHistory`: Returns a list of chat history events from the sender to the receiver up to the specified limit.
- `bus.updateTask`: Updates the task with the given ID and new status, as well as optional data.
- `bus.getTasks`: Retrieves an array of tasks.
- `bus.getTaskMeta`: Returns metadata about the current task, including its count and maximum updated_at value.
- `bus.heartbeat`: Registers or updates an agent with the given name, role, process ID, and status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | No | Provides a lightweight in-memory database for testing. |
| `../lib/db` | Yes | Provides the message bus implementation under test. |

## Side Effects
- Database: The file creates and deletes tables, messages, agents, tasks, and other data in the mock database to simulate real-world scenarios during testing.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
