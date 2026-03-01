---
source_hash: 1b6840d0e7bb69f8
facts_hash: 6b79459db7c76a52
generated_at: 2026-02-25T12:02:02.699Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/Budget.js

## Purpose
The Budget.js file exports a class, `BudgetManager`, which is responsible for managing task budgets in the system. The class provides methods to check if a task has budget remaining and to record usage of tokens by a task. It uses a database to store and retrieve task metadata.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Exports a new instance of the BudgetManager class |

## Internal Logic
The main execution flow involves creating an instance of the `BudgetManager` class, which initializes its default budget limit. The class has two methods: `check` and `record`. The `check` method retrieves task metadata from the database and checks if the task's current cost exceeds its budget limit. If it does, the method logs a warning message to the console. The `record` method updates the task's metadata in the database with the new token usage.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `db` | Yes | Provides access to the database |
| `./db` | No | Implements a helper function for interacting with the database |

## Side Effects
- console_output: The class logs warning messages and informational messages to the console when budget limits are exceeded or updated.
- database: The class updates task metadata in the database when token usage is recorded.

## Dependents
No known dependents.

## Cross-References
- [db.js](./db.js.md)
