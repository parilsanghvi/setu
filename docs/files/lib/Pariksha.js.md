---
source_hash: 32087ba5edae5e5f
facts_hash: 3601956e8ff2d73c
generated_at: 2026-02-25T12:04:16.069Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: lib/Pariksha.js

## Purpose
This file defines the Pariksha class, which is responsible for running tests and enforcing a Test-Driven Development (TDD) cycle to ensure that test-driven code is implemented correctly.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Creates a new instance of the Pariksha class. |
| `Pariksha` | cjs_prop | Exposes the Pariksha class for use in other modules. |

## Internal Logic
The main execution flow of the Pariksha class involves the following key functions:

- The constructor initializes the execPromise property, which is a promise that executes a command, and sets the logger instance.
- The `runTest` method runs a specific test command in a specified working directory and returns a promise that resolves to an object with success and output properties.
- The `enforce` method enforces the TDD cycle by first running the test command, writing code using the provided callback function, and then running the test command again. It throws errors if the test passes before code is written or if the implementation does not fix the test.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality for the Pariksha class. |
| `util` | No | Provides utility functions, including the promisify function used to create a promise from the exec function. |

## Side Effects
- database: 
- subprocess:
  - The `runTest` method runs a subprocess that executes a test command and captures its output.
  - The `enforce` method also runs two subprocesses: one to run the initial test and another to run the final test after code has been written.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
