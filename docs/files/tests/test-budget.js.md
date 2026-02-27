---
source_hash: b359fbe40cadc3b0
facts_hash: b3f2ba05785bd2d6
generated_at: 2026-02-25T12:19:31.373Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-budget.js

## Purpose
This file provides tests for the BudgetManager class, specifically its check and record methods. It uses a mock database to simulate various scenarios and verifies that the BudgetManager behaves as expected.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockDb` | arrow | `{ prepare: (sql) }` | Returns the mock database object with a prepared SQL statement. |
| `mockGet` | arrow | `` | Mocks the get method of the mock database. |
| `mockPrepare` | arrow | `{ get: (...args) }` | Mocks the prepare method of the mock database, allowing it to return mock results for query execution. |
| `mockRun` | arrow | `` | Mocks the run method of the mock database, allowing it to return mock results for query execution. |
| `resetMock` | function | `` | Resets the mock state, restoring default values for get, run, and other mocks. |

## Internal Logic
The test file starts by setting up a mock database with prepare, get, and run methods that can be overridden to simulate various scenarios. The BudgetManager class is then required and tested against various inputs.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Implements the BudgetManager class being tested. |
| `node:assert` | No | Provides assertion utilities for testing. |
| `module` | No | Supplies the require function used to load the BudgetManager module. |
| `node:test` | No | Provides testing utilities and API surface. |

## Side Effects
- console_output: The test file captures and verifies log messages from the console, including warnings in certain scenarios.
- database: The mock database is used to simulate various queries and updates, allowing the BudgetManager's behavior to be tested in isolation.

## Dependents
No known dependents.

## Cross-References
- [Budget.js](../lib/Budget.js.md)
