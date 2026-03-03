---
source_hash: 03b05e27f75b88ed
facts_hash: 57972f6909686ca7
generated_at: 2026-03-03T07:40:13.586Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: tests/test-docker.js

## Purpose
This file tests the functionality of the `Docker` module, ensuring it correctly detects Docker's presence and handles various scenarios such as availability checks, execution, and configuration.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockExecSync` | arrow | `` | Executes a command synchronously. |
| `mockSpawn` | arrow | `` | Spawns a new process. |
| `resetDockerModule` | function | `` | Resets the Docker module to its default state. |

## Internal Logic
The main execution flow involves:
- Setting up mock configurations and functions to control the behavior of the tests.
- Testing various scenarios, including detection of Docker's presence, availability checks, and execution.
- Verifying that the `Docker` module correctly handles these scenarios.

Key functions include:
- `resetDockerModule`: Resets the Docker module to its default state.
- `mockExecSync` and `mockSpawn`: Mocks the behavior of the `execSync` and `spawn` methods in the child process module.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Docker` | Yes | Provides the Docker class to be tested. |
| `module` | No | Provides helper utilities for mocking the `require` function. |

## Side Effects
- subprocess: The tests create and wait for subprocesses created by the mock `spawn` and `execSync` functions to complete before proceeding with further assertions.

## Dependents
No known dependents.

## Cross-References
- [Docker.js](../lib/Docker.js.md)
