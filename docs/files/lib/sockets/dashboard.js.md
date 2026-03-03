---
source_hash: 9057dfb6a90dce3c
facts_hash: 546046ab8232557a
generated_at: 2026-03-03T07:26:51.145Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: lib/sockets/dashboard.js

## Purpose
The DashboardSocket class handles incoming connections to a dashboard socket, emitting log history and chat messages, watching for log file changes, polling the database for updates, and sending agent and task data to connected clients.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `DashboardSocket` | cjs_default | Exports a DashboardSocket class that handles dashboard-related functionality. |

## Internal Logic
The main execution flow of the DashboardSocket class involves setting up event listeners for incoming connections, watching log files for changes, polling the database for updates, and sending data to connected clients.

Key functions:

* `setup`: Sets up event listeners for incoming connections, watches log files for changes, polls the database for updates, and sends agent and task data to connected clients.
* `stop`: Closes any open resources, such as the poll interval and watchers.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `path` | Yes | Provides path manipulation utilities. |
| `fs` | No | Provides file system functions for watching log files. |
| `db` | Yes | Provides database access to interact with the backend. |
| `../utils` | Yes | Provides utility functions, including readLastLines. |

## Side Effects
* database:
	+ `readLastLines`: Reads the last lines of a log file and returns them as an array.
	+ `db.db.prepare` and `db.db.all`: Execute SQL queries against the database to retrieve data for agents and tasks.
* filesystem_read: 
	+ `fs.statSync` and `fs.createReadStream`: Read file metadata and create streams to handle large files.

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- [utils.js](../utils.js.md)
