---
source_hash: a0ac0f3afa104b15
facts_hash: de3a28cc7fc6395f
generated_at: 2026-03-04T05:35:54.039Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/Docker.js

## Purpose
This file defines a class named Docker, which is responsible for managing the Docker engine on the system. The class has methods to detect the presence of Docker, check its availability, and run processes inside containers. It also exports an instance of the Docker class.

| Export | Type | Description |
|--------|------|-------------|
| constructor | cjs_default | Initializes the Docker instance and detects the Docker path |
| detectDocker | function | Attempts to find the Docker executable using the 'which' command |
| checkAvailability | function | Verifies that Docker is available by running the '--version' command |
| run | function | Spawns a process inside a container with specified image, command, and options |

## Internal Logic
The main execution flow of the Docker class begins in its constructor. The constructor initializes a new Logger instance, detects the Docker path, and checks its availability using the checkAvailability method.

The detectDocker method uses the 'which' command to find the Docker executable on the system.

The checkAvailability method spawns the '--version' command using the child_process module and listens for the 'error', 'close', and 'exit' events. If Docker is not available, it sets the enabled flag to false.

The run method takes an image, command, and options as parameters. It creates a list of arguments by merging the default network disablement with the specified mounts and env vars. The method then spawns a new process using the detected Docker executable.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| Config | Yes | Provides configuration settings for the Docker path |
| Logger | Yes | Logs events and warnings during the initialization of the Docker instance |
| child_process | No | Enables the execution of system commands to detect and check Docker availability |

## Side Effects
- subprocess: The Docker instance spawns a new process using the detected Docker executable when running a container, which may lead to resource utilization and potentially cause issues if not managed properly.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
- [Logger.js](./Logger.js.md)
