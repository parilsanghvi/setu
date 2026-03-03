---
source_hash: 95724118f9d611ef
facts_hash: d549dea34505b7b6
generated_at: 2026-03-03T07:29:16.721Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: scripts/init_swarm.js

## Purpose
This file initializes the swarm agents by seeding their data into the database using the Bus heartbeat method. It sets the initial status of each agent to 'OFFLINE'. The process also updates the role and status of overlapping agents in the database.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `db` | object | - | Provides a connection to the database |
| `agents` | array | - | A list of agent objects with name and role properties |

## Internal Logic
The main execution flow involves iterating over each agent in the agents array and using the Bus heartbeat method to upsert their data into the database. The process uses prepared statements to ensure consistency.

Key functions:

- `stmt.run(agent.name, agent.role)`: Executes a prepared statement to insert or update an agent's data.
- `agents.forEach(agent => { ... })`: Iterates over each agent in the agents array.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `db` | Yes | Provides database functionality |

## Side Effects
- console_output: The script logs messages to the console, including a notification that the swarm seeding process has completed.
- database: The script inserts or updates data in the 'agents' table of the database using prepared statements.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
