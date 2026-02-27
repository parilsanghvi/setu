---
source_hash: 56715ad0e475c048
facts_hash: c35af52bc0730651
generated_at: 2026-02-25T12:33:10.802Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/verify-core.js

## Purpose
This file verifies the existence of two agents, Tark and Guru, in a database. It spawns instances of these agents using child processes and waits for them to be registered in the database before exiting with success or failure. The verification process checks the database after a 5-second delay.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | `command, options` | Spawns a new child process executing the given command. |

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `spawn` | function | `command, options` | Spawn a new child process executing the given command. |

## Internal Logic
The main execution flow of this file is as follows: 
- It spawns two instances of Tark and Guru agents in separate child processes.
- After 5 seconds, it checks if both agents are registered in the database by querying the `agents` table.
- If both agents are found, it logs a success message and exits with status code 0. Otherwise, it logs an error message and exits with status code 1.

The key function in this file is the anonymous `setTimeout` callback, which performs the verification of the agent's existence in the database.

| Key Function | Description |
|---------------|-------------|
| `setTimeout`   | Waits for a specified time before checking if the agents are registered in the database. |

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `spawn` | Yes  | Provides low-level process creation capabilities |
| `../lib/db` | Yes  | Allows interaction with the database, enabling verification of agent registration |
| `child_process` | No   | Enables spawning of child processes for running the agents |
| `path`     | No    | Provides utility functions for working with file paths |

## Side Effects
- console_output: The file logs messages to the console indicating the status of the verification process.
- database: The file queries and updates the `agents` table in the database as part of the verification process.
- process_control: The file uses the `process.exit()` method to control the exit status of the parent process based on the outcome of the verification.
- subprocess: The file spawns two child processes for running the Tark and Guru agents.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
