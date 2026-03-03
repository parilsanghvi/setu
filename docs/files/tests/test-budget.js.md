---
source_hash: b359fbe40cadc3b0
facts_hash: 56494c68ca867a87
generated_at: 2026-03-03T07:34:46.597Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: tests/test-budget.js

## Purpose
This file contains tests for the BudgetManager class, which is responsible for managing budgets and querying a mock database. The tests cover various scenarios, including checking if a task exists and updating its cost.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockDb` | arrow | `{ prepare: (sql) => { ... } }` | Returns the mock database object. |
| `mockGet` | arrow | `` | Mocks the get method of the mock database. |
| `mockPrepare` | arrow | `{ get: (...args) => { ... } }` | Mocks the prepare method of the mock database. |
| `mockRun` | arrow | `` | Mocks the run method of the mock database. |
| `resetMock` | function | `` | Resets the mocks to their initial state. |

## Internal Logic
The main execution flow involves setting up the mock database and mocking the required methods. The key functions are:

* `resetMock`: Resets the mocks to their initial state.
* `mockDb`, `mockGet`, `mockPrepare`, and `mockRun` are used to set up the mock database and test scenarios.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Provides the BudgetManager class. |
| `node:assert` | No | Provides assertion functions for testing. |
| `module` | No | Provides utility functions, including require and prototype methods. |

## Side Effects
- console_output: The test suite logs messages to the console when a warning is triggered.
- database: The mock database stores queries and their results during the test execution.

## Dependents
No known dependents.

## Cross-References
- [Budget.js](../lib/Budget.js.md)
