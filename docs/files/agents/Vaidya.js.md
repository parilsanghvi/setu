---
source_hash: 028c19077094b40b
facts_hash: 56f34944f9c1a6b5
generated_at: 2026-03-03T07:05:50.352Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Vaidya.js

## Purpose
The Vaidya.js file defines a class `Vaidya` that extends the `Agent` class from the `../lib/Agent` module. The `Vaidya` class is responsible for booting up the system by checking various components, including environment, Docker, database, and node modules. If all components are healthy, it verifies that the system can speak to confirm its status.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Vaidya` | cjs_default | Exposes a constructor function to create new instances of the Vaidya class. |

## Internal Logic
The main execution flow of the Vaidya.js file is as follows:

- The `boot()` method is called, which logs messages to the console indicating system status and checks various components.
- The `checkEnv()`, `checkDocker()`, `checkDB()`, and `checkNodeModules()` methods are called in sequence to verify environment variables, Docker connectivity, database health, and node module dependencies.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Agent` | Yes | Provides a base class for agents in the system. |
| `../lib/Config` | Yes | Offers configuration management functionality. |
| `../lib/db` | Yes | Enables database interaction and agent counting. |
| `child_process` | No | Used to execute Docker commands from within the script. |
| `fs` | No | Utilized for file system operations such as checking for the existence of files. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The script logs messages to the console indicating its progress and any errors that occur during the boot process.
- database: The script interacts with a database to check its health and count agents.
- env_access: The script accesses environment variables to verify their presence and values.
- filesystem_read: The script checks for the existence of files, including the `.env` file and the `node_modules` directory.
- process_control: The script uses process control to exit the program with a non-zero status code if the system is not healthy.
- subprocess: The script executes Docker commands from within the script using the `child_process` module.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
- [Config.js](../lib/Config.js.md)
- [db.js](../lib/db.js.md)
