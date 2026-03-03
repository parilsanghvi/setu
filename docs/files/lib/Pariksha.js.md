---
source_hash: 7dcc34456f659eed
facts_hash: ad1acb257747808d
generated_at: 2026-03-03T07:16:40.366Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: lib/Pariksha.js

## Purpose
This file exports an instance of the Pariksha class, which is responsible for running test commands and enforcing the TDD (Test-Driven Development) cycle. The class provides a way to run tests with specific command-line arguments and validate that the code changes meet the test requirements. It also logs information during the testing process.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Creates a new Pariksha instance with default settings. |
| `Pariksha` | cjs_prop | Returns the exported Pariksha class instance. |

## Internal Logic
The main execution flow of this file involves creating an instance of the Pariksha class and using its methods to run test commands and enforce the TDD cycle. The key functions are:
- `runTest`: Runs a specific test command with the given arguments and returns the output.
- `enforce`: Enforces the TDD cycle by running the initial test, writing code changes, and then re-running the test to ensure it passes.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality for the Pariksha class. |
| `util` | No | Extends the Node.js util module with promisified functions for better error handling. |

## Side Effects
- Database: None
- subprocess: The `runTest` method uses the `execPromise` function to run a test command in a subprocess, capturing its output and logging it.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
