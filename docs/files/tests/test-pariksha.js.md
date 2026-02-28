---
source_hash: 40ab7b2710a435f5
facts_hash: fcfd2fb4974c7b7c
generated_at: 2026-02-25T12:28:02.830Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-pariksha.js

## Purpose
This file contains unit tests for the Pariksha class, which is used to enforce Test-Driven Development (TDD) cycles and ensure that test commands succeed.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockExec` | arrow | `cmd, opts` | Executes a mock command with given parameters |
| `writeCodeFn` | arrow | `` | A callback function for writing code during the TDD cycle |
| `runTest` | method |  | Runs a test command and returns its result |

## Internal Logic
The Pariksha class is initialized with a mock execution function, which allows the class to simulate the behavior of real commands. The main execution flow involves:

1. The `enforce` method, which takes a test name, a current directory, and a callback function for writing code.
2. Inside `enforce`, the `runTest` method is called with the given test name and directory.
3. If the test passes initially, it should return TDD VIOLATION error; otherwise, it should allow further execution of the cycle.
4. After passing initial tests or failing them, execute the written code using the mock command.
5. The `runTest` method returns success or failure based on whether the executed command succeeds or fails.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Pariksha` | Yes | Provides TDD cycle enforcement functionality |
| `node:assert` | No | Asserts testing conditions and expected results |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [Pariksha.js](../lib/Pariksha.js.md)
