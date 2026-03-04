---
source_hash: 028c19077094b40b
facts_hash: bc2810d901974f7d
generated_at: 2026-03-04T05:25:16.256Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Vaidya.js

## Purpose
The Vaidya.js file defines a class that extends the Agent class from the lib/Agent module, which is responsible for booting up the Vaidya agent and verifying its health by checking various components such as environment variables, Docker connectivity, database operations, and node modules.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Vaidya` | cjs_default | Exports a class that extends the Agent class to perform boot-up checks. |

## Internal Logic
The main execution flow of the Vaidya.js file is as follows:

- The constructor initializes the agent with its name, description, and log directory.
- The `boot()` method is called when the agent boots up, which performs the following checks:
  - `checkEnv()`: Verifies if environment variables are set correctly and logs a warning if not found.
  - `checkDocker()`: Checks if Docker is running by executing the `docker --version` command.
  - `checkDB()`: Connects to the database to check for any errors or inconsistencies.
  - `checkNodeModules()`: Verifies if node modules are installed and up-to-date.
- If all checks pass, it logs a success message; otherwise, it exits with an error code.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Agent` | Yes | Provides the base Agent class for extending. |
| `../lib/Config` | Yes | Configures environment variables and other settings. |
| `../lib/db` | Yes | Interacts with the database to check its health. |
| `child_process` | No | Executes system commands for Docker checks. |
| `fs` | No | Reads and writes files to verify node modules existence. |
| `path` | No | Manages file paths for environment variable and log directory setup. |

## Side Effects
- console_output: Logs success or error messages to the console during boot-up checks.
- database: Performs a query on the database to retrieve agent counts.
- env_access: Accesses environment variables to verify their existence and values.
- filesystem_read: Reads files in the node_modules directory to check for its presence.
- process_control: Exits the process with an error code if all health checks fail.
- subprocess: Executes system commands using child_process to run Docker commands.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
- [Config.js](../lib/Config.js.md)
- [db.js](../lib/db.js.md)
