---
source_hash: 028c19077094b40b
facts_hash: 13724e3c717a41d0
generated_at: 2026-02-25T11:55:24.723Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Vaidya.js

## Purpose
The Vaidya.js file defines a class named Vaidya, which extends the Agent class and is responsible for checking the health of the system by verifying the environment, Docker connectivity, database, and node modules.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Vaidya` | cjs_default | Exports a Vaidya instance that can be used to boot the agent. |

## Internal Logic
The main execution flow of the Vaidya.js file is as follows:

* The constructor initializes the Vaidya instance with its name, description, and log directory.
* The `boot` method is called when the agent is booted, which checks the health of the system by calling four sub-methods: `checkEnv`, `checkDocker`, `checkDB`, and `checkNodeModules`. If all checks pass, it reports a healthy system; otherwise, it exits with an error code.
* The `checkEnv` method checks if the environment variables are set correctly, including API keys for LLM features.
* The `checkDocker` method checks if Docker is running and connected.
* The `checkDB` method checks if the database is operational by counting the number of agents in the database.
* The `checkNodeModules` method checks if the node modules are installed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `Agent` | Yes | Provides a base class for agents. |
| `Config` | Yes | Supplies configuration data. |
| `db` | Yes | Offers database access functionality. |
| `child_process` | No | Enables execution of system commands. |
| `fs` | No | Allows file system interactions. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The agent logs messages to the console, including success or failure messages, warnings, and errors.
- database: The agent accesses the database to check its health and retrieve agent counts.
- env_access: The agent reads environment variables, including API keys for LLM features.
- filesystem_read: The agent reads files from the file system, such as the `.env` file and node modules directory.
- process_control: The agent controls the process flow by exiting with an error code if any checks fail.
- subprocess: The agent executes system commands using child processes to check Docker connectivity.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
- [Config.js](../lib/Config.js.md)
- [db.js](../lib/db.js.md)
