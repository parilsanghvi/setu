---
source_hash: 041851c4c3a2cfc3
facts_hash: 743e71ddc8f9fd9e
generated_at: 2026-03-04T06:01:09.269Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-events.js

## Purpose
This file tests the detection of Tool Events (Tool Start/End) using a modified version of the CoreAgent, which is extended by the Steering Agent script. The test verifies that the tool start and end events are correctly detected in the output from the steering agent. The test also checks for timeouts if the events are not detected within a certain time frame.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `fork` | function | `agentScript, args, options` | Creates a new child process and executes the given script. |
| `stdout.on('data')` | event listener | `(data)` | Handles incoming data from the child process's standard output stream. |

## Internal Logic
The main execution flow of this file is as follows:
- The test creates a new child process using the `fork` function, which executes the Steering Agent script.
- The test sets up an event listener on the child process's standard output stream to capture any incoming data.
- When data is received, it is processed and checked for the presence of Tool Start/End events in the accumulated output.
- If the events are detected, a success message is logged, and the child process is killed.
- If no events are detected within a certain time frame, a timeout error message is logged, and the child process is killed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides the necessary functionality for creating new processes. |
| `path` | No | Enables path manipulation to join directory and script paths. |

## Side Effects
- console_output: The test writes output from the child process's standard output stream directly to the console, which may be logged in other parts of the system.
- database: This file does not interact with a database; it only processes output from the steering agent.
- process_control: The test kills the child process when events are detected or a timeout occurs.
- subprocess: A new child process is created and executed using the `fork` function.

## Dependents
No known dependents.

## Cross-References
No cross-references.
