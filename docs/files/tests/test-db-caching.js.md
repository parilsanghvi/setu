---
source_hash: fb97b79cbee89578
facts_hash: 6f933e74bafc6555
generated_at: 2026-02-25T12:22:40.044Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/test-db-caching.js

## Purpose
This file tests the caching behavior of the bus module in a Node.js application, specifically verifying that certain methods return cached results.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Database` | class | `` | Exports a mock database class for testing. |
| `deadAgentQuery` | arrow | `prepares.find(q => q.includes('FROM agents') && q.includes('last_heartbeat'))` | Returns the query string for the 'getDeadAgents' method. |
| `getAgentsQuery` | arrow | `prepares.find(q => q.includes('FROM agents ORDER BY name'))` | Returns the query string for the 'getAgents' method. |
| `getNewMessagesQuery` | arrow | `prepares.find(q => q.includes('FROM messages WHERE id > ?'))` | Returns the query string for the 'getNewMessages' method. |
| `getTaskMetaQuery` | arrow | `prepares.find(q => q.includes('MAX(updated_at)'))` | Returns the query string for the 'getTaskMeta' method. |
| `getTasksQuery` | arrow | `prepares.find(q => q.includes('SELECT * FROM tasks') && !q.includes('MAX'))` | Returns the query string for the 'getTasks' method. |

## Internal Logic
The main execution flow of this file is as follows:
1. The test module requires the necessary modules, including a mock implementation of `better-sqlite3`.
2. The `bus` module is required and its cache is cleared to ensure a fresh instance.
3. Various methods on the `bus` object are called multiple times to simulate frequent access patterns.
4. The cached results of these method calls are checked against expected counts, verifying that caching is working correctly.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides the bus module with its cache and database functionality. |
| `module` | No | Used for mocking the `require` function. |

## Side Effects
- database: The mock database instance created by `Module.prototype.require` is used to store cached results for the various method calls on the `bus` object.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
