---
source_hash: 4a6216c0df0ee052
facts_hash: a48bb055293bfe2f
generated_at: 2026-03-03T07:08:17.841Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: bin/setu-init.js

## Purpose
This file initiates the Setu Swarm project setup process, creating necessary directories and files, generating context documents, and sending a message to the central database.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `contextTemplate` | arrow | `role` | Generates a system overview context document for a given role. |
| `generateContext` | arrow | `filePath, role, content` | Creates or updates a context document at the specified file path with the provided role and content. |

## Internal Logic
The main execution flow involves:
- Argument parsing to set the target directory.
- Creating the `.setu` directory if it doesn't exist.
- Generating system overview documents for the root context, backend (Tark), frontend (Shilpi), and infra directories.
- Sending a message to the central database indicating project adoption.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system functionality. |
| `path` | No | Offers path manipulation utilities. |
| `../lib/db` | Yes | Enables communication with the central database. |

## Side Effects
- console_output: The script logs messages to the console indicating its progress and any errors that occur.
- database: The script sends a message to the central database when setting up the project, and handles errors if this fails.
- filesystem_read: The script checks if files exist before attempting to generate or update them.
- filesystem_write: The script creates new files and updates existing ones in the target directory.
- process_control: The script exits with a status code of 0 once all setup is complete.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
