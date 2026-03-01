---
source_hash: b033396e13a2720f
facts_hash: f07e02a128104444
generated_at: 2026-02-25T12:23:09.236Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-dead-agents.js

## Purpose
This file contains tests for the `getDeadAgents` function in the database layer, specifically verifying that it correctly identifies and returns dead agents based on their last heartbeat timestamp.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `bus.getDeadAgents` | function | `(threshold)` | Returns an array of dead agent objects. |
| `bus.db.prepare` | function | `(sql, ...args)` | Prepares a SQL query for execution with the given arguments. |
| `deadNames` | arrow | `()` | Returns an array of names from the dead agents. |

## Internal Logic
The main execution flow involves inserting two agents into the database: one live agent with a recent heartbeat and one dead agent with an older timestamp. The `getDeadAgents` function is then called with a threshold value, which determines the minimum age for an agent to be considered dead. The returned array of dead agents is verified against expected results, including the presence and absence of specific agents.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides access to the database. |
| `assert` | No | Used for assertions in testing. |

## Side Effects
- console_output: The file logs messages to the console using `console.log`, including a test result message and agent names.
- database: The file inserts data into the `agents` table of the database, including a live agent with a recent heartbeat and a dead agent with an older timestamp. It also deletes the same agents from the table after testing.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
