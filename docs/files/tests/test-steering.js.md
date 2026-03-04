---
source_hash: 2b1cd3076ca16327
facts_hash: 2afa9c3fbe652355
generated_at: 2026-03-04T06:08:27.246Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-steering.js

## Purpose
This file tests the steering functionality of an agent by sending it control signals to interrupt, redirect, and resume its execution. The test verifies that the agent responds correctly to these signals and performs the expected behavior. The output is piped to the main console for real-time monitoring.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `fork` | function | `script, args, options` | Creates a new child process from the given script and arguments. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `fork` function creates a new child process that runs the `steering-agent.js` script.
2. The test waits for the agent to start its loop by listening for the "Starting loop..." message in the output.
3. Once the loop starts, the test sends a STOP signal to the agent after 2 seconds (approx 4 turns).
4. If the agent responds with an Execution HALTED or INTERRUPTED message, the test verifies that it has been interrupted correctly and proceeds to send a REDIRECT signal.
5. The test waits for the agent to respond with a Redirecting attention and Priority Override message, which indicates that it has received the redirect signal.
6. If the agent responds as expected after the redirect, the test verifies that its loop resumed correctly by looking for Resuming loop for Redirect or Calling LLM messages in the output.
7. Finally, if all tests pass, the child process is killed and the main process exits with a successful status code.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides the fork function for creating child processes. |
| `path` | No | Helps construct the path to the steering-agent.js script. |

## Side Effects
- console_output: The test outputs messages to the main console in real-time, allowing it to monitor the agent's response to control signals.
- database: There is no interaction with a database in this file.
- process_control: The test sends control signals to the child process using its send method, controlling the behavior of the steering-agent.js script.
- subprocess: A new child process is created and managed by the fork function, which runs independently of the main process.

## Dependents
No known dependents.

## Cross-References
No cross-references.
