---
source_hash: b033396e13a2720f
facts_hash: 7a3c4dd600486487
generated_at: 2026-03-04T05:59:26.722Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-dead-agents.js

## Purpose
This file tests the functionality of the `getDeadAgents` function in the system, which returns a list of dead agents. It inserts two agents, one live and one dead, and then verifies that the `getDeadAgents` function correctly identifies the dead agent. The test also ensures that the returned agent has the expected properties.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| bus    | object | -       | Provides database operations  |
| assert | function | -       | Verifies assertions in tests |

## Internal Logic
The test file first logs a message to the console to indicate that it is running. It then inserts two agents into the database: one live agent with a heartbeat timestamp of the current time, and one dead agent with an old heartbeat timestamp set manually. The `getDeadAgents` function is called with a timeout of 30 seconds, and the returned list of dead agents is stored in the `dead` variable.

The test then extracts the names from the dead agents and asserts that one of them is "TestDead" and not "TestLive". It also verifies that each dead agent has the expected properties.

Finally, the test cleans up by deleting the live and dead agents from the database.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes  | Used for assertions in tests |
| bus    | Yes  | Provides database operations |

## Side Effects
- console_output: The file logs two messages to the console, one before running the test and another after it passes.
- database: The file inserts two agents into the database and then deletes them after the test is complete.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
