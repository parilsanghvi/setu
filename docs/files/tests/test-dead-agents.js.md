---
source_hash: b033396e13a2720f
facts_hash: be299bd173e9b36c
generated_at: 2026-03-03T07:39:17.838Z
generator_version: 1.0.0
model: cheap
quality_score: 72
---
# File: tests/test-dead-agents.js

## Purpose
This file tests the functionality of the `getDeadAgents` method in the database connection, verifying that it correctly identifies dead agents and returns their names.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `bus` | object | - | Provides a database connection interface |
| `assert` | module | - | Assists with assertions and testing |

## Internal Logic
The main execution flow of this file is as follows:
- The script connects to the database using the `bus` object.
- It inserts two agents into the database: one live agent with a recent heartbeat and one dead agent with an old timestamp.
- It calls the `getDeadAgents` method on the `bus` object, specifying a timeout of 30 seconds.
- The resulting list of dead agents is printed to the console and its names are extracted using the `map` function.
- Assertions are used to verify that the correct dead agent was found and that the live agent was not included in the result.
- After the test, the script deletes the inserted agents from the database.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| bus    | Yes  | Provides a database connection interface |
| assert | No   | Assists with assertions and testing |

## Side Effects
- console_output: The script logs messages to the console, including a test prefix, a pass message after successful execution, and error messages if any assertions fail.
- database: The script inserts two agents into the database, deletes them afterwards, and retrieves data from the `agents` table.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
