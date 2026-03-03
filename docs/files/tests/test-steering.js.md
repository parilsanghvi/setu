---
source_hash: 2b1cd3076ca16327
facts_hash: 54393fb323a37680
generated_at: 2026-03-03T07:48:18.489Z
generator_version: 1.0.0
model: cheap
quality_score: 73
---
# File: tests/test-steering.js

## Purpose
This file tests the steering functionality of a child process, which includes sending stop and redirect signals to an agent script. The test verifies the agent's response to these signals and ensures that it resumes its loop correctly after being redirected. The test concludes with the termination of the subprocess.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `fork` | function |  | Creates a new child process. |
| `path` | module |  | Provides utilities for working with file paths. |

## Internal Logic
The main execution flow of this script involves:

1. Creating a child process using `fork`, which runs the agent script.
2. Establishing an IPC connection between the parent and child processes to receive output from the child.
3. Iteratively processing the output from the child, performing specific actions based on the received data.

Key functions include:
- `child.stdout.on('data')`: Processes incoming data from the child process and takes action accordingly.
- `setTimeout()`: Waits for a specified amount of time before taking further action.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fork` | No | Provides low-level functionality for creating new processes. |
| `path` | No | Utilizes path-related functionalities for locating the agent script. |

## Side Effects
- console_output: The script outputs logs and error messages to the parent process's console.
- database: There is no explicit interaction with a database in this file, but it may be used indirectly through the child process.
- process_control: The script sends control signals (`STOP` and `REDIRECT`) to the child process using IPC.
- subprocess: A new child process is created using `fork`, which runs an independent instance of the agent script.

## Dependents
No known dependents.

## Cross-References
No cross-references.
