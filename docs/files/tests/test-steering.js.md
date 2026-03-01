---
source_hash: 2b1cd3076ca16327
facts_hash: 7cc3d558e1f4616c
generated_at: 2026-02-25T12:29:55.363Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-steering.js

## Purpose
This file contains a test script that interacts with the steering agent, sending signals to control its behavior and verifying the expected outcomes. The script uses the child_process module to create a fork of the agent script and communicates with it through standard input/output streams. The test checks for various scenarios, including sending stop and redirect signals, to ensure the agent behaves as expected.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `fork` | function | `[agentScript, args]` | Creates a new child process from an executable file |
| `path.join` | function | `[dirname, filename]` | Joins two paths together to form a new path |

## Internal Logic
The main execution flow of this script is as follows:
- It creates a fork of the steering agent script using the child_process module.
- It sets up event listeners for the standard output and error streams of the child process.
- When data is received from the child process, it checks for specific messages to determine what action to take (e.g. send stop signal, verify redirect).
- Based on the message received, it sends a corresponding signal to the child process or logs a success message.
- If the child process terminates normally after sending the stop signal and verifying the redirect, the script exits successfully.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides functionality for creating and interacting with child processes |
| `path` | No | Provides utility functions for working with file paths |

## Side Effects
- console_output: The script pipes the output of the child process to both its own standard output and the main console, allowing the user to see the progress of the test.
- database: There is no interaction with a database in this script.
- process_control: The script sends control signals to the child process using its standard input stream, controlling its behavior during the test.
- subprocess: The script creates a new subprocess by forking an existing executable file (the steering agent script) to interact with it independently.

## Dependents
No known dependents.

## Cross-References
No cross-references.
