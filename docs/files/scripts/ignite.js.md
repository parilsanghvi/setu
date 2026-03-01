---
source_hash: f6ef5595e61c1f27
facts_hash: 956d382068c8a6d5
generated_at: 2026-02-25T12:14:13.906Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/ignite.js

## Purpose
This file, `ignite.js`, is the main entry point of the Setu system, responsible for igniting the frontend and backend applications, launching the setup wizard if necessary, and sending activation signals to the kernel. It orchestrates the startup process of the system. The `launchSystem` function is the primary execution flow.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | `cmd, options` | Spawns a new child process. |
| `console.log` | function | `message` | Logs messages to the console. |
| `fs.existsSync` | function | `path` | Checks if a file or directory exists. |
| `new Promise` | constructor | `(resolve, reject)` | Creates a promise that resolves or rejects after a timeout. |
| `bus.send` | function | `type, user, text, cmd, data` | Sends a message to the bus system. |

## Internal Logic
The main execution flow starts by checking if a `.env` configuration file exists. If it does not exist, the setup wizard is launched and the script waits for its completion before proceeding.

1. The `launchSystem` function is called, which spawns two child processes: one for the frontend (The Dashboard) using Vite, and another for the backend (The Kernel) using Node.js.
2. After spawning these processes, the script waits for 5 seconds to allow stabilization.
3. During this time, an auto-kickstart activation signal is sent to the kernel after a 5000ms delay.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides a way to spawn new child processes. |
| `fs` | No | Offers functions for working with the file system, but it's not used in this script directly. |
| `path` | No | Helps resolve paths and manipulate file systems, but its functionality is not utilized here. |
| `bus` | Yes | Enables communication between different parts of the system through message passing. |

## Side Effects
- console_output: The script logs messages to the console using `console.log`.
- filesystem_read: The script uses `fs.existsSync` to check if a file or directory exists.
- process_control: The script kills child processes using their kill functions when the process is interrupted (`SIGINT`).
- subprocess: The script spawns two new child processes for the frontend and backend applications.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
