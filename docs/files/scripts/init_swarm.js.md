---
source_hash: 95724118f9d611ef
facts_hash: 7dacd91cfdbc83e9
generated_at: 2026-02-25T12:14:24.305Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/init_swarm.js

## Purpose
This file initializes the swarm agents by upserting them into the database, ensuring they are initially marked as offline. The `init_swarm.js` file plays a crucial role in seeding the swarm with necessary agent data, which is then used to boot the system. It utilizes the Bus heartbeat method for updating agent statuses.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| db | object |  | Provides database connectivity utilities |
| agents | array |  | An array of agent objects to be seeded into the database |

## Internal Logic
The main execution flow of this file involves iterating over the `agents` array and upserting each agent into the database using the Bus heartbeat method. The key functions involved are:

- `db.db.prepare()`: Prepares a SQL statement for insertion or update.
- `stmt.run()`: Executes the prepared statement with the provided parameters.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| db | Yes | Enables database operations and connectivity |
| '../lib/db' | Yes | Facilitates database interactions through its API |

## Side Effects
- console_output: The script logs messages to the console indicating successful agent upserts, providing a visual confirmation of the seeding process.
- database: The script initializes the swarm agents by inserting or updating them in the `agents` table with their respective roles and statuses.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
