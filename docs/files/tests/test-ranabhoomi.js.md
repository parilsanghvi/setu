---
source_hash: 2236375597911d34
facts_hash: 74836d018c72d649
generated_at: 2026-02-25T12:28:42.909Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-ranabhoomi.js

## Purpose
This file contains a test function that verifies the functionality of Ranabhoomi, a Docker sandbox, by running a simple Node.js application and checking its output.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `docker` | object |  | Provides an interface to interact with the Docker environment. |
| `test` | function | `` | Runs a test to verify the Ranabhoomi setup and checks its output. |

## Internal Logic
The main execution flow of this file is as follows:
- The `test` function is called to start the verification process.
- It first checks if the Docker environment is enabled, and if not, it skips the test and exits the process.
- Then, it runs a Node.js application in a Docker container using the `docker.run` method.
- It sets up event listeners for the stdout and stderr of the child process to log its output.
- When the child process exits, it logs the exit code and checks if the test passed or failed based on the exit code.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `docker` | Yes | Provides an interface to interact with the Docker environment. |
| `../lib/Docker` | No | 

## Side Effects
- console_output: The test function logs messages to the console, including success or failure messages, and output from the child process.
- database: There is no database interaction in this file.
- process_control: The test function exits the process if Docker is not enabled, effectively controlling the flow of the program.

## Dependents
No known dependents.

## Cross-References
- [Docker.js](../lib/Docker.js.md)
