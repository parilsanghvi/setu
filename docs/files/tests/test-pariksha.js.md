---
source_hash: 782ee0a6b2000c26
facts_hash: 8fed60bceb6ee9d2
generated_at: 2026-03-03T07:45:19.817Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/test-pariksha.js

## Purpose
This file tests the functionality of the Pariksha class, which is responsible for running and enforcing TDD (Test-Driven Development) cycles. The `runTest` method checks the success of a command, while the `enforce` method enforces a valid TDD cycle by writing code initially if necessary. 

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockExec` | arrow | `file, args, opts` | Executes a mock command and returns its output. |
| `writeCodeFn` | arrow | `` | Returns a function to write code for the next test. |

## Internal Logic
The main execution flow of this file involves testing the `Pariksha` class with various scenarios to ensure it functions as expected. The key methods are:

- `runTest`: This method takes a command and checks if its execution is successful by returning an object containing the success status and output.
- `enforce`: This method enforces a valid TDD cycle by first checking if the test passes initially, then throwing a `TDD VIOLATION` error. If not, it writes code for the next test using the provided `writeCodeFn`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Pariksha` | Yes | Provides the Pariksha class to be tested. |
| `node:assert` | No | Imports the assert module for assertions in tests. |

## Side Effects

## Dependents
No known dependents.

## Cross-References
- [Pariksha.js](../lib/Pariksha.js.md)
