---
source_hash: 7dcc34456f659eed
facts_hash: cb594616bd629b22
generated_at: 2026-03-04T05:36:30.643Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/Pariksha.js

## Purpose
The Pariksha file exports a single instance of the `Pariksha` class, which is used to validate Test-Driven Development (TDD) cycles by running test commands and ensuring that tests pass after code is written.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| new    | cjs_default | Creates a new instance of the Pariksha class |
| Pariksha| cjs_prop | Instantiates the Pariksha class with default values |

## Internal Logic
The main execution flow involves creating an instance of the `Pariksha` class, which runs test commands and validates TDD cycles. The key functions include:

- `runTest`: Runs a specific test command and returns a promise with the test result.
- `enforce`: Validates a TDD cycle by running initial tests, writing code, and re-running tests to ensure passing results.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| child_process | No | Provides an interface for executing external commands |
| Logger    | Yes | Supplies logging functionality |
| util      | No | Offers utility functions, including promisify |

## Side Effects

- database: None
- subprocess: The `runTest` and `enforce` methods execute test commands, which may spawn new processes.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
