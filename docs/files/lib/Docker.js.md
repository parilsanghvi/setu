---
source_hash: 7e0cdc925df34b73
facts_hash: d09869529ffc907c
generated_at: 2026-02-25T12:03:36.971Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: lib/Docker.js

## Purpose
This file provides a Docker class that enables sandboxing and runs processes inside containers. The `run` method is used to spawn a process inside a container, allowing for environment variable management, mount point configuration, and network isolation. It also checks the availability of Docker and logs warnings if necessary.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Docker` | cjs_default | Initializes and configures a Docker instance. |
| `detectDocker` | function | Attempts to detect the presence of Docker on the system. |
| `checkAvailability` | function | Verifies if Docker is installed and configured correctly. |
| `run` | function | Spawns a process inside a container, managing environment variables and mount points. |

## Internal Logic
The main execution flow involves initializing the Docker instance, detecting its presence, and checking for availability. The `checkAvailability` method spawns a Docker command to check for version compatibility. If Docker is not available or fails to run, it logs warnings and disables sandboxing.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | Yes | Provides spawn function for process management. |
| `path` | No | Used for path manipulation and configuration settings. |
| `Config` | Yes | Retrieves configuration settings, including Docker installation path. |

## Side Effects
- console_output: The file logs warnings to the console if Docker is not configured or fails to run, indicating potential issues with sandboxing.
- database: There are no explicit database interactions in this file.
- subprocess: The `detectDocker`, `checkAvailability`, and `run` methods spawn subprocesses using the `child_process.spawn` function to manage Docker processes.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
