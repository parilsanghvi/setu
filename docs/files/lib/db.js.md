---
source_hash: adf13fbc08649b65
facts_hash: 1108c92bf5abdf39
generated_at: 2026-03-03T07:18:45.419Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: lib/db.js

## Purpose
This file defines a class `Bus` that serves as an event bus wrapper, managing database interactions and emitting events to various parts of the system.

| Export | Type | Description |
|--------|------|-------------|
| send   | function | Sends a message to the messaging table in the database. |
| getUnread | function | Retrieves unread messages for a given recipient. |
| getChatHistory | function | Retrieves chat history between an agent and another entity. |
| markRead | function | Marks a set of message IDs as read. |
| heartbeat | function | Updates the last heartbeat timestamp for an agent. |
| getDeadAgents | function | Retrieves agents with a heartbeats older than a given timeout period. |
| updateTask | function | Updates a task's status and emits an event if it's marked as DONE or ESCALATED. |

## Internal Logic
The main execution flow of this file involves:

- Creating a new `Database` object to interact with the SQLite database.
- Defining various caching mechanisms for prepared statements using an object called `stmts`.
- Implementing methods like `send`, `getUnread`, and `updateTask` that use these cached statements to perform CRUD operations on the database tables.

The class's main methods include:
- `constructor`: Initializes the `Bus` instance with a new database connection.
- `send`, `getUnread`, `heartbeat`, and other functions: These are event-driven functions that interact with the database using prepared statements, which are cached for better performance.
- `updateTask`: This method updates a task's status in the database while emitting events based on the task's updated status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs      | Yes   | Provides file system utilities. |
| path     | No    | Used to construct file paths for the database. |
| better-sqlite3 | No  | Provides a SQLite database interface. |

## Side Effects
- console_output: The `console.log` statements are used to output debug information when the `LOG_LEVEL` environment variable is set to 'verbose'.
- database: The file interacts with the SQLite database using prepared statements and updates its tables as needed.
- env_access: The file accesses the `LOG_LEVEL` environment variable to determine whether to log debug messages.
- filesystem_read: The file reads files in the database directory (set by `os.homedir()`) when creating a new database connection.
- filesystem_write: The file writes data to the database files, including updates to the messaging and tasks tables.
- network: None
- subprocess: None

## Dependents
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)

## Cross-References
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)
