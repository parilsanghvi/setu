---
source_hash: fb97b79cbee89578
facts_hash: 601676d03c072743
generated_at: 2026-03-03T07:38:42.103Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-db-caching.js

## Purpose
This file tests the caching functionality of the Bus class, specifically its prepared statements, and verifies that certain methods return cached results. The test suite ensures that calls to `getDeadAgents`, `getAgents`, `getTasks`, `getTaskMeta`, and `getNewMessages` are properly cached.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `bus` | object | `` | Exports the Bus class with caching functionality. |
| `Database` | class | `` | A mock database class used to test prepared statement caching. |
| `deadAgentQuery` | arrow | `prepares.find(q` | Identifies a query for checking dead agent cache hits. |
| `getAgentsQuery` | arrow | `prepares.find(q` | Identifies a query for checking cached getAgents results. |
| `getNewMessagesQuery` | arrow | `prepares.find(q` | Identifies a query for checking cached getNewMessages results. |
| `getTaskMetaQuery` | arrow | `prepares.find(q` | Identifies a query for checking cached getTaskMeta results. |
| `getTasksQuery` | arrow | `prepures.find(q` | Identifies a query for checking cached getTasks results. |

## Internal Logic
The main execution flow of this file involves:
1. Setting up a mock database using the `better-sqlite3` module.
2. Creating an instance of the Bus class and clearing its cache to ensure fresh results are retrieved.
3. Calling various methods on the Bus instance, including `getDeadAgents`, `getAgents`, `getTasks`, `getTaskMeta`, and `getNewMessages`.
4. Verifying that each method returns a cached result by checking the prepared statement counts in the mock database.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `bus` | Yes | Provides the Bus class with caching functionality. |
| `../lib/db` | Yes | Imports the bus module to test its behavior. |
| `module` | No | Used for module manipulation and prototype extension. |
| `node:assert` | No | Provides assertion testing utilities. |
| `node:test` | No | Enables unit testing for the file. |

## Side Effects
- database: The mock database is populated with prepared statement counts to track cache hits during the test execution.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
