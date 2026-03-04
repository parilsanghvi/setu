---
source_hash: 1b6840d0e7bb69f8
facts_hash: 614fdc7e33aab488
generated_at: 2026-03-04T05:34:10.442Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/Budget.js

## Purpose
This file exports an instance of the `BudgetManager` class, which is responsible for managing a budget for tasks, tracking usage and cost, and alerting when budgets are exceeded.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `budgetManager` | cjs_default | Exports an instance of the BudgetManager class |

## Internal Logic
The main execution flow of this file involves creating a new instance of the `BudgetManager` class, which initializes with a default budget limit. The key functions are:

- `check(taskId)`: Verifies if a task has remaining budget by querying the database for the task's cost so far and comparing it to the set budget limit.
- `record(taskId, tokens)`: Records usage of a task by calculating the cost of tokens used and updating the task's meta data in the database.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| db      | Yes  | Provides access to the database |
| require('./db') | No   | Enables database connection |

## Side Effects
- console_output: The `console.warn` function is called when a task exceeds its budget, logging a warning message to the console.
- database: The `db.db.prepare` and `db.db.run` functions are used to interact with the database, updating tasks' meta data when usage records are added.

## Dependents
No known dependents.

## Cross-References
- [db.js](./db.js.md)
