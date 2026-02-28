---
source_hash: 4a6216c0df0ee052
facts_hash: caf52c30248978e3
generated_at: 2026-02-25T11:57:20.842Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: bin/setu-init.js

## Purpose
This script initiates the Setu Swarm, a project management system, by creating necessary directories and files within the specified target path. The `generateContext` function creates a CONTEXT.md file for each component (Backend, Frontend, Infra) in the project. It then sends an adoption message to the Sutradhar role using the lib/db module.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `contextTemplate` | arrow | `role` | Returns a template string for a CONTEXT.md file. |
| `generateContext` | arrow | `filePath, role, content` | Creates a CONTEXT.md file at the specified path with the given role and content. |

## Internal Logic
The script's main execution flow is as follows:
1. It checks if an argument (`--path`) is provided, and if so, sets the target path to that value.
2. It creates the `.setu` directory in the target path if it doesn't exist.
3. It generates CONTEXT.md files for each component (Backend, Frontend, Infra) using the `generateContext` function.
4. If a docker-compose.yml file exists, it creates an infra directory and generates a CONTEXT.md file for it.
5. It sends an adoption message to the Sutradhar role using the lib/db module.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system operations. |
| `path` | Yes | Provides path manipulation utilities. |
| `../lib/db` | No | Connects to the central DB and enables message sending. |

## Side Effects
- console_output: The script logs messages to the console, including creation of directories, files, and successful or failed adoption messages.
- database: The script uses the lib/db module to send an adoption message to the Sutradhar role in the central DB.
- filesystem_read: The script checks if a directory or file exists before creating it.
- filesystem_write: The script creates new files and directories in the target path.
- process_control: The script exits with a status code of 0 after completing its tasks.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
