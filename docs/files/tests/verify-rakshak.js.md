---
source_hash: f5ca5cc884158649
facts_hash: 88920516a2070d80
generated_at: 2026-03-03T07:55:05.946Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: tests/verify-rakshak.js

## Purpose
This file verifies the existence of a Rakshak agent in the system's database after spawning it using the `child_process` module. It checks for the presence of an agent with the name "Rakshak" and reports success or failure accordingly.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function |  | Spawns a new child process running the specified command |
| `path.join` | function |  | Joins two or more path segments into an absolute path |
| `db.prepare` | method |  | Prepares a SQL query for execution on the database |

## Internal Logic
The main execution flow involves spawning the Rakshak agent using `spawn`, waiting for 5 seconds, and then querying the database to check for the existence of the "Rakshak" agent. The code uses `setTimeout` to pause execution and allow the spawned process to run.

| Key Function | Description |
|--------------|-------------|
| `spawn` | Runs the specified command in a new child process |
| `path.join` | Resolves relative paths to absolute paths |
| `db.prepare` | Executes a SQL query on the database |

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | Yes | Provides a way to spawn and manage child processes |
| `../lib/db` | Yes | Offers database interaction utilities |
| `path` | No | Supplies path manipulation functions for resolving relative paths |

## Side Effects
- console_output: The script logs "Spawning Rakshak..." before spawning the agent, "✅ Verification SUCCESS: Rakshak is alive." when the verification passes, and "❌ Verification FAILED: Rakshak not found." when it fails.
- database: The script queries the "agents" table to check for the existence of a record with the name "Rakshak".
- process_control: The script uses `process.exit(0)` to indicate successful completion and `process.exit(1)` to indicate failure, controlling the parent process's exit status.
- subprocess: A new child process is spawned using `spawn`, running the Rakshak agent code.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
