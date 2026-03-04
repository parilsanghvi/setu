---
source_hash: 3b14c8c966c03c0f
facts_hash: 1307db4b61baf219
generated_at: 2026-03-04T05:28:12.848Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: bin/test-dashboard.js

## Purpose
This file contains a test script that verifies the correctness of data sources used in the dashboard, specifically agent and task fetching, as well as GUI-specific stats calculation. The test ensures that the expected data is retrieved from the database and processed correctly. It uses the `db` module to interact with the database and the `assert` module for assertions.

## Exports / API Surface
| Export | Description |
|-------|-------------|
| db    | Provides a database interface to execute SQL queries. |

## Internal Logic
The main execution flow of this file is as follows:

1. The script initializes by requiring the necessary modules, including `db` and `assert`.
2. It then attempts to run a series of tests on the dashboard data sources using the `db` module.
3. For each test, it executes an SQL query using `db.db.prepare()` and retrieves the results using methods like `all()`, `get()`, or executing the query directly.
4. The script logs the results of each test to the console and performs assertions using `assert` to verify that the expected data types are returned.
5. If all tests pass, the script exits with a success code (0); otherwise, it catches any errors, logs an error message to the console, and exits with a failure code (1).

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| db     | Yes   | Provides database functionality. |
| assert | No    | Validates data types for expected results. |

## Side Effects
- console_output: The script logs messages to the console indicating test results and any errors.
- database: The script interacts with the database using SQL queries, which may modify or read data in the database.
- process_control: The script exits the process with a success code (0) if all tests pass, or a failure code (1) if an error occurs.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
