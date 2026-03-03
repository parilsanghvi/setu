---
source_hash: 54aa6649d5f352fb
facts_hash: 097f9f25ba42a0d7
generated_at: 2026-03-03T07:15:20.681Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: lib/Contractor.js

## Purpose
This file defines a class called `Contractor` that manages contracts, which are essentially draft specifications for tasks in a domain. The `Contractor` class allows users to issue new specs, record vetoes from Lead agents, and approve the current spec. It also provides methods to load and save the contract data.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| contractor | cjs_default | Exports a single instance of the Contractor class. |

## Internal Logic
The main execution flow involves creating an instance of the `Contractor` class, passing in a contracts path. The constructor loads the contract data from file if it exists or returns an empty object otherwise. The key methods include:

- `load()`: Loads the contract data from file if it exists.
- `save()`: Saves the contract data to file.
- `issueSpec(taskId, domain, spec)`: Issues a new spec for a task with the given ID and domain.
- `recordVeto(taskId, agentName, reason)`: Records a veto from a Lead agent for the specified task.
- `approve(taskId)`: Approves the current spec for the specified task.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides file system interaction functions. |
| path | No | Provides path manipulation functions. |

## Side Effects

- console_output: Logs messages to the console, including success and warning messages when specs or vetoes are issued or received.
- filesystem_read: Reads contract data from file if it exists.
- filesystem_write: Writes contract data to file after changes are made.

## Dependents
No known dependents.

## Cross-References
No cross-references.
