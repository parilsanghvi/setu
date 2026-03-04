---
source_hash: 54aa6649d5f352fb
facts_hash: ce341792b86ef92a
generated_at: 2026-03-04T05:35:09.559Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: lib/Contractor.js

## Purpose
This file provides a JavaScript class named `Contractor` that manages contracts and specifications for tasks, allowing for the issuance of new specs, recording vetoes, and approving current specs.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `issueSpec` | function | Issues a new spec (contract draft) for a task. |
| `recordVeto` | function | Records a veto from a Lead agent for a task. |
| `approve` | function | Approves the current spec for a task. |
| `getSpec` | function | Returns the spec for a task. |
| `Constructor` | class | Constructor for managing contracts and specifications. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `Contractor` class is instantiated, and its constructor loads existing contracts from a JSON file.
2. Methods such as `issueSpec`, `recordVeto`, `approve`, and `getSpec` modify the loaded contracts and save them to the JSON file accordingly.

Key functions include:
- `load`: Loads existing contracts from a JSON file.
- `save`: Saves the current contracts to a JSON file.
- `issueSpec`: Issues a new spec (contract draft) for a task, updating the contracts and saving the changes.
- `recordVeto`: Records a veto from a Lead agent for a task, updating the contracts and saving the changes.
- `approve`: Approves the current spec for a task, updating the contracts and saving the changes.
- `getSpec`: Returns the spec for a task.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system operations. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The file logs console messages to the standard output, including success and veto messages.
- filesystem_read: The file reads existing contracts from a JSON file using `fs.readFileSync`.
- filesystem_write: The file writes updated contracts to a JSON file using `fs.writeFileSync`.

## Dependents
No known dependents.

## Cross-References
No cross-references.
