---
source_hash: 3b14c8c966c03c0f
facts_hash: 059c5967971f4947
generated_at: 2026-03-03T07:08:48.521Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: bin/test-dashboard.js

## Purpose
This file tests the dashboard data sources by verifying that agents and tasks are fetched correctly from the database, and then displays statistics about active and pending agents and tasks.

## Exports / API Surface


| Export | Description |
|--------|-------------|
| `db`   | Provides an interface to interact with the database. |
| `assert` | Enables assertion testing for verifying expected conditions. |

## Internal Logic
The main execution flow involves preparing database queries, fetching data, and asserting its correctness.

- The file starts by requiring the necessary modules: `db` for database interaction and `assert` for unit testing.
- It then logs a message to indicate the start of the test.
- Four separate sections are tested:
  1. Fetching agents from the database using `db.db.prepare('SELECT name, role, status, pid FROM agents').all()`.
  2. Fetching tasks from the database using `db.db.prepare('SELECT id, status, owner, title FROM tasks ORDER BY updated_at DESC LIMIT 20').all()`.
  3. Calculating and displaying statistics about active agents and pending tasks.
- Each query is executed and its result is logged to the console along with a success message.
- Assertions are used to verify that the results conform to expected data structures.

## Dependencies


| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides an interface to interact with the database. |
| `assert` | No | Enables assertion testing for verifying expected conditions. |

## Side Effects
- console_output: The test logs messages to the console, including success and failure indicators.
- database: The test interacts with the database by executing queries and retrieving data from it.
- process_control: The test exits the process with a specific status (0 for success, 1 for failure) after completion.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
