---
source_hash: 1b6840d0e7bb69f8
facts_hash: c891fac9d7a6cae7
generated_at: 2026-03-03T07:14:27.830Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/Budget.js

## Purpose
This file exports a single instance of the `BudgetManager` class, which is responsible for managing task budgets in an application. The class provides two main methods: `check` and `record`, which allow it to determine if a task has remaining budget and record usage respectively. It also maintains internal state through its constructor.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `BudgetManager` | cjs_default | Handles task budget management for an application |

## Internal Logic
The main execution flow of this file is as follows:
- The `BudgetManager` class is instantiated with a default limit.
- The `check` method is called to determine if a task has remaining budget.
- If the task has remaining budget, it increments its usage cost and logs an update message.
- The `record` method is called to record usage for a task.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `db` | Yes | Provides database access to store task metadata |

## Side Effects
- console_output: 
  - Logs warning messages when a task exceeds its budget limit.
  - Logs updates with the number of tokens used and the total cost for a task.
- database:
  - Stores task metadata, including usage costs, in a SQLite database.

## Dependents
No known dependents.

## Cross-References
- [db.js](./db.js.md)
