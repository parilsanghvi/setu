---
source_hash: 95724118f9d611ef
facts_hash: 3409feb013842ce7
generated_at: 2026-03-04T05:48:35.361Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/init_swarm.js

## Purpose
This file seeds the swarm agents by initializing their status as OFFLINE in the database, and logs updates to the console for verification.

## Exports / API Surface
| Symbol | Type | Params | Description |
| `db` | Object | - | Provides helper utilities for interacting with the database. |
| `agents` | Array | - | An array of agent objects used for seeding in the swarm. |

## Internal Logic
The main execution flow involves iterating over the `agents` array and using the `db` object to upsert each agent into the database. The key function is `stmt.run(agent.name, agent.role)`, which inserts or updates an agent's data in the database based on whether it already exists.

## Dependencies
| Module | Local | Why |
| `../lib/db` | Yes | Provides a connection to the database for seeding agents. |

## Side Effects
- console_output: The file logs updates to the console using `console.log` statements, confirming each agent's upsert.
- database: The file seeds the swarm agents by inserting or updating their data in the database, initializing their status as OFFLINE.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
