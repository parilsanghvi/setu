---
source_hash: 56715ad0e475c048
facts_hash: fa9f6d7fd73a4891
generated_at: 2026-03-03T07:52:23.780Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: tests/verify-core.js

## Purpose
This file, `verify-core.js`, is a test script that verifies the functionality of two agents, Tark and Guru, by checking if they are registered in the database within a specified time frame. The script uses the `bus` object to interact with the database. It spawns the backend processes for Tark and Guru using the `child_process` module.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| spawn  | function | Array | Spawns a new process |
| prepare | method | String | Prepares a SQL query to execute |
| find   | method | Arrow Function | Finds an element in an array by name |

## Internal Logic
The script consists of the following key steps:
- Spawn Tark and Guru backend processes using `spawn`.
- Set a timeout of 5 seconds after which the verification checks are performed.
- Use the `prepare` method to execute a SQL query on the database, selecting all records from the `agents` table.
- Find the agents Tark and Guru in the retrieved array by their names using the `find` method.
- Check if both agents are found; if so, log success and exit with code 0, otherwise log failure and exit with code 1.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| child_process | No | Provides process creation functionality |
| path | No | Offers file system utility functions |
| db       | Yes | Facilitates database interactions |

## Side Effects
- console_output: The script logs various messages to the console, including success and failure messages, as well as the spawned processes.
- database: The script executes a SQL query on the `agents` table in the database, potentially modifying or retrieving data.
- process_control: The script spawns two new processes using the `spawn` function, effectively taking control of the main thread to execute the backend processes.
- subprocess: The script interacts with the spawned subprocesses (Tark and Guru) by sending input and receiving output, allowing it to verify their functionality.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
