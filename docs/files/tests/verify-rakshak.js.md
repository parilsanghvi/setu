---
source_hash: f5ca5cc884158649
facts_hash: 2b9778e7952e908d
generated_at: 2026-02-25T12:34:30.009Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/verify-rakshak.js

## Purpose
This file verifies the presence of a Rakshak agent in the system by spawning it and checking for its existence in the database. The `spawn` function is used to launch the Rakshak agent, and the `bus.db.prepare` method is employed to interact with the database. If the agent is found, the verification is successful; otherwise, an error message is displayed.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
|  | function | req, res | Handles incoming requests |
| `if` | method | `rk` | Verifies if the Rakshak agent exists |
| `rk` | arrow | `agents.find(a` | Retrieves the first matching agent from the database |

## Internal Logic
The main execution flow involves spawning the Rakshak agent, waiting for a specified timeout period, and then checking the database for the agent's existence. The key function in this process is `spawn`, which launches the Rakshak agent, while `bus.db.prepare` is used to query the database.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
|  | Yes | Provides helper utilities |
| `../lib/db` | Yes | Interacts with the system database |

## Side Effects
- console_output: Displays success or failure messages to the console.
- database: Retrieves and queries data from the system database.
- process_control: Exits the process based on the verification outcome.
- subprocess: Spawns a new process to run the Rakshak agent.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
