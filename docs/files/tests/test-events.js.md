---
source_hash: 041851c4c3a2cfc3
facts_hash: 2e01c1d53a6f2983
generated_at: 2026-02-25T12:24:42.569Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-events.js

## Purpose
This file tests the Structured Events (Tool Start/End) functionality by running a steering agent script in isolation and verifying that it sends the expected Tool Events to the console.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `fork` | function |  | Creates a new child process from a given script. |
| `child.stdout.on('data')` | event listener | `(data)` | Handles incoming data from the child process's stdout. |

## Internal Logic
The main execution flow of this file is as follows:

1. The steering agent script is forked and run in isolation using `fork(agentScript, [], { stdio: ['inherit', 'pipe', 'pipe', 'ipc'] })`.
2. The file sets up an event listener on the child process's stdout to handle incoming data.
3. When data is received from the child process, it checks if the accumulated output contains both "tool_start" and "tool_end" messages.
4. If both messages are found, it logs a success message, kills the child process, and exits the current process with a successful status code (0).
5. If no match is found after a 10-second timeout, it logs an error message indicating a timeout, kills the child process, and exits the current process with a failed status code (1).

| Key Function | Description |
|--------------|-------------|
| `fork` | Creates a new child process from a given script. |
| `child.stdout.on('data')` | Handles incoming data from the child process's stdout. |

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `path` | Yes | Provides path manipulation utilities to join directory paths. |
| `child_process` | No | Provides functions for interacting with child processes, such as `fork`. |

## Side Effects
- console_output: The file writes data to the console in real-time using `process.stdout.write(chunk)`.
- database: There is no direct interaction with a database in this file.
- process_control: The file kills and exits the current process after verifying or failing the Tool Events detection.
- subprocess: A new child process is created and managed through `fork` and its associated events.

## Dependents
No known dependents.

## Cross-References
No cross-references.
