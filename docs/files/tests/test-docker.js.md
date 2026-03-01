---
source_hash: 03b05e27f75b88ed
facts_hash: 74837a733b8ffde4
generated_at: 2026-02-25T12:24:05.427Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: tests/test-docker.js

## Purpose
This file contains a set of tests for the Docker module, which is used to interact with Docker containers. The tests cover various scenarios, including detection of the Docker executable, configuration of the DOCKER_PATH environment variable, and execution of Docker commands.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockExecSync` | arrow | `` | Mocks execSync function to return a specific value. |
| `mockSpawn` | arrow | `` | Mocks spawn function to simulate child process behavior. |
| `resetDockerModule` | function | `` | Resets the Docker module by deleting its cache entry. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `resetDockerModule` function is called before each test to reset the Docker module's cache entry.
2. The `mockConfig` object is initialized with default values or specific configuration for each test case.
3. The `mockExecSync` and `mockSpawn` functions are overridden to simulate different behaviors during the tests.
4. The `Docker` class is required and tested in various scenarios, including detection of the Docker executable, configuration of the DOCKER_PATH environment variable, and execution of Docker commands.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Docker` | Yes | Provides the Docker module implementation. |
| `events` | No | Not used in this file. |

## Side Effects
- Subprocess: The `mockSpawn` function simulates child process behavior by emitting a 'close' event with a status code after a short delay, mimicking the behavior of spawning a new process.

## Dependents
No known dependents.

## Cross-References
- [Docker.js](../lib/Docker.js.md)
