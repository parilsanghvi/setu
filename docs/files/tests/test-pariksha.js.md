---
source_hash: 782ee0a6b2000c26
facts_hash: 7986fc4e59a24de6
generated_at: 2026-03-04T06:05:39.998Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/test-pariksha.js

## Purpose
This file contains unit tests for the `Pariksha` class, which is responsible for running and enforcing Test-Driven Development (TDD) cycles in a command-line environment.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `runTest` | method | `file, opts` | Runs a test command and returns the result |
| `enforce` | method | `cmd, opts, writeCodeFn` | Enforces a TDD cycle by running tests and writing code if necessary |
| `mockExec` | arrow | `file, args, opts` | Mock execution function for testing |

## Internal Logic
The main execution flow of this file involves three key functions: `describe`, `it`, and the methods `runTest` and `enforce`. The `describe` function groups related tests together, while the `it` function defines individual test cases. The `runTest` method runs a command and returns its result, which is then asserted in each test case. The `enforce` method enforces a TDD cycle by running tests and writing code if necessary.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Pariksha` | Yes | Implements the Pariksha class being tested |
| `node:assert` | No | Provides assertion utilities for testing |

## Side Effects

## Dependents
No known dependents.

## Cross-References
- [Pariksha.js](../lib/Pariksha.js.md)
