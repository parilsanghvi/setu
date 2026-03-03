---
source_hash: 4dc824c571909285
facts_hash: d94b0515ebb7be42
generated_at: 2026-03-03T07:07:06.776Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: benchmarks/repro_prepare.js

## Purpose
This file, `repro_prepare.js`, is a benchmarking script that measures the performance of SQLite's `prepare` method in two different scenarios: executing a prepared statement in a loop versus executing it once. It creates a test database, sets up a table with sample data, and then executes two versions of a query to measure the difference.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `db`   | Establishes a connection to an in-memory SQLite database  |
| `ITERATIONS` | Defines the number of iterations for benchmarking  |

## Internal Logic
The script starts by establishing a connection to an in-memory SQLite database using the `better-sqlite3` module. It then creates two tables: one with sample data and another empty table.

The main execution flow involves two loops:

1. The first loop, which executes the prepared statement (`SELECT * FROM tasks WHERE status = ?`) 100,000 times while iterating over a range of numbers from 0 to `ITERATIONS - 1`. This simulates a scenario where the same SQL query is executed in a loop.

2. The second loop does the exact same thing as the first one but executes the prepared statement only once for each iteration.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | Yes  | Enables SQLite database operations |
| `console` | No   | Provides logging functionality |

## Side Effects
- database: The script creates a temporary in-memory SQLite database and populates it with sample data.
- subprocess: None

## Dependents
No known dependents.

## Cross-References
No cross-references.
