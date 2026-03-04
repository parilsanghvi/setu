---
source_hash: 346d38d9491e0863
facts_hash: bdece07bdb5a8339
generated_at: 2026-03-04T05:48:26.267Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/ignite.js

## Purpose
This file ignites the Setu mission control system, launching both the frontend (The Dashboard) and backend (The Kernel), and sending an activation signal to start the workflow management process.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | `command, options` | Spawns a new child process. |
| `path.resolve` | function | `dirname, path` | Resolves a relative path to an absolute one. |
| `fs.existsSync` | function | `filePath` | Checks if a file or directory exists. |
| `console.log` | function | `message` | Prints a message to the console. |
| `setTimeout` | function | `timeout, callback` | Schedules a task to be executed after a specified timeout. |

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | `command, options` | Launches a new child process. |
| `launchSystem` | function | `` | Starts the main execution flow of the Setu mission control system. |

## Internal Logic
The main execution flow consists of the following key functions:
- **`launchSystem()`**: This function is responsible for launching both the frontend and backend systems, sending an activation signal after a 5-second delay.
- The **`spawn()`** function is used to launch new child processes for the frontend and backend systems.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides utility functions for working with child processes. |
| `fs` | No | Provides file system utilities. |
| `path` | No | Provides path manipulation utilities. |
| `bus` | Yes | Allows communication between different parts of the system through a message bus. |

## Side Effects
- console_output: Prints messages to the console, including warnings and success messages.
- filesystem_read: Checks if a configuration file exists using `fs.existsSync()`.
- process_control: Listens for the `SIGINT` signal to shut down the process when interrupted.
- subprocess: Launches new child processes for the frontend and backend systems using `spawn()`.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
