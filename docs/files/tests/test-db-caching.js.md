---
source_hash: fb97b79cbee89578
facts_hash: d02d05620fd2104b
generated_at: 2026-03-04T05:58:45.578Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-db-caching.js

## Purpose
This file tests the caching behavior of the Bus class, specifically its methods for retrieving prepared statements, dead agents, tasks, task metadata, and new messages.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Database` | class | `` | Defines a mock database class. |
| `bus` | object | `` | Provides methods for interacting with the Bus instance. |
| `deadAgentQuery` | arrow | `prepares.find(q` | Returns the query string for retrieving dead agents. |
| `getAgentsQuery` | arrow | `prepares.find(q` | Returns the query string for retrieving agents. |
| `getNewMessagesQuery` | arrow | `prepares.find(q` | Returns the query string for retrieving new messages. |
| `getTaskMetaQuery` | arrow | `prepares.find(q` | Returns the query string for retrieving task metadata. |
| `getTasksQuery` | arrow | `prepares.find(q` | Returns the query string for retrieving tasks. |

## Internal Logic
The main execution flow of this file involves mocking the `better-sqlite3` module to avoid loading native bindings, creating a mock database instance with the `Module.prototype.require` override, and then testing the caching behavior of the Bus class's methods.

Key functions:

- `if (id === 'better-sqlite3')`: Checks if the current module being required is the `better-sqlite3` module.
- `prepare(sql)`: Normalizes whitespace in SQL queries and updates a prepare count for the query.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides the Bus class instance with its methods. |
| `node:assert` | No | Used for asserting expected values in tests. |
| `node:test` | No | Used to write and run unit tests. |
| `module` | No | Required by the `Module.prototype.require` override. |

## Side Effects
- database: The mock database instance created with the `Module.prototype.require` override is used throughout the test file.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
