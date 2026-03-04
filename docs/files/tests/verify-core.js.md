---
source_hash: 56715ad0e475c048
facts_hash: c9e66ec601ca8ecd
generated_at: 2026-03-04T06:12:01.143Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/verify-core.js

## Purpose
This file is used to verify the existence of two agents, Tark and Guru, in a database after spawning their corresponding backend processes. It checks if the agents are alive and registered by querying the database after a 5-second delay. If successful, it logs a success message and exits with code 0; otherwise, it logs an error message and exits with code 1.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | - | Spawns a new process by executing a command. |
| `require` | module | - | Imports the required modules for the file. |
| `bus.db.prepare` | method | 'SELECT * FROM agents' | Prepares a SQL query to select all records from the 'agents' table. |

## Internal Logic
The main execution flow of this file involves spawning two backend processes, Tark and Guru, using the `spawn` function, waiting for 5 seconds, and then querying the database to check if both agents are alive and registered.

- The `spawn` function is used to execute the Tark and Guru backend processes by executing the corresponding JavaScript files.
- The `setTimeout` function is used to wait for a 5-second delay before checking if the agents are in the database.
- The `bus.db.prepare` method is used to prepare a SQL query to select all records from the 'agents' table.
- The `all()` method of the prepared statement returns an array of objects representing the selected rows, which are then logged to the console.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides a way to spawn new processes. |
| `path` | No | Helps resolve file paths for the spawned processes. |
| `../lib/db` | Yes | Provides access to the database used to store agent information. |

## Side Effects
- console_output: The console.log statements print messages to the console, including the spawning of Tark and Guru processes and the results of the verification.
- database: The file queries the 'agents' table in the database to check if both agents are alive and registered.
- process_control: The file uses the `spawn` function to control the execution of Tark and Guru backend processes.
- subprocess: The spawned Tark and Guru processes can be considered sub-processes, which run independently of the main verification script.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
