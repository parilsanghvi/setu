---
source_hash: 2236375597911d34
facts_hash: d5bdf63c028a7157
generated_at: 2026-03-03T07:46:06.436Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-ranabhoomi.js

## Purpose
This file contains a single test function named `test`, which is responsible for testing the Ranabhoomi Docker sandbox by running a Node.js application inside a Docker container. The test checks if Docker is enabled and runs the container with specific mounts and environment variables.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `docker` | object | `` | Provides Docker functionality |
| `test` | function | `` | Runs the test function |

## Internal Logic
The main execution flow of this file is as follows:

1. The `test` function is called, which logs a message to the console indicating that it's testing Ranabhoomi.
2. A timeout of 1000ms is used to allow Docker to check its availability before proceeding.
3. If Docker is not enabled, the test exits with a code of 0 and logs a warning message to the console.
4. If Docker is enabled, the test runs a Node.js container using the `docker.run` method.
5. The test listens for three types of events:
	* stdout: it logs any output received from the container to the console.
	* stderr: it logs any error messages received from the container to the console.
	* exit: it checks the exit code of the container and logs a success or failure message to the console based on the code.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Docker` | Yes | Provides Docker functionality for running containers. |

## Side Effects
- console_output: The test logs messages to the console indicating its progress and any errors or results.
- process_control: The test exits with a code of 0 if Docker is not enabled, or exits with a non-zero code otherwise, depending on the exit status of the container.
- no database interaction: There are no interactions with a database in this test.

## Dependents
No known dependents.

## Cross-References
- [Docker.js](../lib/Docker.js.md)
