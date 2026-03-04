---
source_hash: 9057dfb6a90dce3c
facts_hash: 77fefe208cd6a7dc
generated_at: 2026-03-04T05:46:24.227Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: lib/sockets/dashboard.js

## Purpose
The DashboardSocket class is responsible for establishing a connection to the dashboard socket, setting up event listeners and watchers, and forwarding messages between the database and clients.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `DashboardSocket` | cjs_default | Exposes the DashboardSocket class for external use |

## Internal Logic
The main execution flow of the file is as follows:

- The constructor initializes the socket and logger.
- The setup() method sets up event listeners for incoming connections, log file watching, and database message forwarding.
  - `io.on('connection')`: Handles incoming client connections, emitting initial log tail data to new clients.
  - `fs.watch(logFile)`: Watches the log file for changes, streaming updated logs to connected clients.
  - `bus.on('message')`: Forwards database messages to connected clients, filtering by message type.
- The pollInterval is set up to periodically poll the database for updates, emitting agent and task lists to connected clients.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../db` | Yes | Provides access to the database. |
| `../utils` | Yes | Offers utility functions like readLastLines. |
| `fs` | No | Used for file system operations. |
| `path` | No | Used for path manipulation. |

## Side Effects
- database: The setup() method forwards database messages to connected clients, and the pollInterval periodically updates the agent and task lists.
- filesystem_read: The log watcher streams updated logs from the log file to connected clients, and the setup() method may also read the entire log file if it doesn't exist yet.

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- [utils.js](../utils.js.md)
