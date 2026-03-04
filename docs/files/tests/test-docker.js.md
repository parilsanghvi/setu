---
source_hash: 03b05e27f75b88ed
facts_hash: 9dd5cc73b859a8eb
generated_at: 2026-03-04T06:00:29.177Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: tests/test-docker.js

## Purpose
This file contains a test suite for the Docker module, ensuring it functions correctly in various scenarios, including detecting the presence of Docker, handling configuration options, and executing container runs.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockExecSync` | arrow | `` | Executes a command synchronously. |
| `mockSpawn` | arrow | `` | Spawns a new process. |
| `resetDockerModule` | function | `` | Resets the Docker module's internal state. |

## Internal Logic
The test suite begins by mocking the require function to return specific values for certain module imports, such as the child_process module and the Config file. The Docker class is then instantiated with mocked environment variables.

Key functions include:

- `detectDocker`: Detects whether a Docker installation is available using the execSync method.
- `run`: Executes a container run command using the spawn function.
- `checkAvailability`: Checks if Docker is installed by attempting to find its executable.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Docker` | Yes | Provides the core functionality of the Docker class. |

## Side Effects
- subprocess: The test suite spawns and waits for multiple processes, including a child process spawned by the Docker's spawn function and an event emitter created with EventEmitter.

## Dependents
No known dependents.

## Cross-References
- [Docker.js](../lib/Docker.js.md)
