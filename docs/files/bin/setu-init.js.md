---
source_hash: 4a6216c0df0ee052
facts_hash: e86eebb256933cd5
generated_at: 2026-03-04T05:27:42.586Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: bin/setu-init.js

## Purpose
This file initiates the setup process for a Setu Swarm project, creating necessary directories and files, generating contextual documents, and sending a message to the bus for project adoption.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `contextTemplate` | arrow | `role` | Generates a context template for a system role. |
| `generateContext` | arrow | `filePath, role, content` | Creates or updates a contextual document at the specified file path. |

## Internal Logic
The main execution flow involves:
- Argument parsing to determine the target project directory.
- Creating necessary directories and files based on the provided configuration.
- Generating context documents for each component (Backend, Frontend, Infra) and sending a message to the bus for project adoption.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities. |
| `path` | No | Offers path manipulation functions. |
| `../lib/db` | Yes | Connects to the central database for message sending and other operations. |

## Side Effects
- console_output: The script logs messages to the console, including creation notifications, errors, and completion announcements.
- database: The script interacts with the central database, sending a message to the bus for project adoption.
- filesystem_read: The script reads file existence checks and file contents from the file system.
- filesystem_write: The script writes new files and updates existing ones in the target directory.
- process_control: The script exits the process upon completion or errors.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
