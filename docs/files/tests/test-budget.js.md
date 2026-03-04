---
source_hash: b359fbe40cadc3b0
facts_hash: 65c84a26b9713227
generated_at: 2026-03-04T05:53:56.978Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: tests/test-budget.js

## Purpose
This file contains unit tests for the `BudgetManager` class, which is responsible for managing budgets and tasks. The tests cover various scenarios, including checking if a task exists, updating costs, and recording tokens. The `mockDb` object simulates a database to test the interactions with it.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockPrepare` | arrow | `{
    get: (...args` | Mocks the prepare method of the BudgetManager class, allowing for custom behavior. |
| `mockDb` | arrow | `{
    prepare: (sql` | Mocks the prepare method of a database object, simulating a query to be executed. |
| `mockGet` | arrow | `` | Mocks the get method of a database object, returning undefined by default. |
| `resetMock` | function | `` | Resets the mock objects used in the tests to their initial state. |

## Internal Logic
The main execution flow of this file involves loading the `BudgetManager` class and setting up mocks for the database interactions. The tests are run using the `test` function from the `node:test` module, which executes each test function passed as an argument. The key functions in this file include:

- `mockPrepare`: Customizes the behavior of the prepare method of the BudgetManager class.
- `mockDb`: Simulates a database object to test interactions with it.
- `mockGet`: Returns undefined by default, but can be overridden to return custom values.
- `resetMock`: Resets the mock objects used in the tests to their initial state.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Provides the BudgetManager class for testing. |
| `node:test` | No | Provides the test framework to run the unit tests. |

## Side Effects
- console_output: The tests log messages using the `console.log` function, and sometimes use `console.warn` to simulate a warning being logged.
- database: The tests interact with the mock database object to simulate queries and updates. When a task is not found, no update is made; when an update occurs, it is captured and verified by the test.

## Dependents
No known dependents.

## Cross-References
- [Budget.js](../lib/Budget.js.md)
