---
source_hash: f6ef5595e61c1f27
facts_hash: df7cce5169a3a7af
generated_at: 2026-03-03T07:29:06.825Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/ignite.js

## Purpose
This file ignites the setup mission control by launching the frontend and backend systems, sending an activation signal to initiate the audit process. It also handles configuration checks and system shutdown on exit.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | { ... } | Spawns a new child process with specified command and options. |
| `new Promise` | constructor | { resolve, reject } | Creates a promise that resolves or rejects after the setup process completes. |

## Internal Logic
The main execution flow begins by checking if the configuration file exists. If not, it launches the setup wizard using a child process to run the `setup.js` script. Once the configuration is complete, it calls the `launchSystem` function to launch the frontend and backend systems.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides a way to spawn new processes. |
| `fs` | No | Offers file system operations for checking configuration files. |
| `path` | No | Helps resolve paths for the child process and configuration file. |

## Side Effects
- console_output: The script logs messages to the console, including setup progress, errors, and final status updates.
- filesystem_read: It checks if the configuration file exists on disk using `fs.existsSync`.
- process_control: It handles exit events by shutting down the processes and exiting the parent process when the SIGINT signal is received.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
