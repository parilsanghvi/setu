---
source_hash: a0ac0f3afa104b15
facts_hash: 8f00a7e7e37032d0
generated_at: 2026-03-03T07:16:01.397Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: lib/Docker.js

## Purpose
The Docker.js file is responsible for managing the Docker engine on a system, ensuring its availability and configuration. The `Docker` class handles the detection of the Docker executable, checks its availability, and provides a method to run processes inside containers. This class plays a crucial role in enabling or disabling sandboxing based on the Docker engine's status.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `run` | function | Runs a process inside a container using the Docker engine. |
| `detectDocker` | function | Detects the path to the Docker executable on the system. |

## Internal Logic
The main execution flow of the Docker.js file begins with the constructor, which initializes the logger and checks for the DOCKER_PATH configuration setting. If the DOCKER_PATH is set, it validates the executable's name; otherwise, it attempts to detect the Docker executable using the `detectDocker` method.

Upon successful detection or if the DOCKER_PATH is invalid, the `checkAvailability` method is called to verify the Docker engine's availability by spawning a process that checks for the version. This method sets the `enabled` property based on the return code of the spawned process and logs the result accordingly.

The `run` method takes an image, command, and options as input and generates the necessary arguments to run a container with the specified configuration. It then spawns a new process using the Docker engine and returns the child process object.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Config` | Yes | Provides access to system-wide configuration settings, including DOCKER_PATH. |
| `./Logger` | Yes | Handles logging operations for the Docker engine's status and events. |

## Side Effects
- Subprocess: The `detectDocker`, `checkAvailability`, and `run` methods spawn subprocesses to interact with the Docker engine.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
- [Logger.js](./Logger.js.md)
