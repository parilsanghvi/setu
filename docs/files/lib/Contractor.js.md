---
source_hash: 54aa6649d5f352fb
facts_hash: 8aa8f4ac4541eff6
generated_at: 2026-02-25T12:02:57.319Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/Contractor.js

## Purpose
The `Contractor` class manages a set of contracts, which are represented as JSON objects, and provides methods for issuing new spec drafts, recording vetoes, approving specs, and retrieving the current state of a contract.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `contractor` | cjs_default | Exports an instance of the Contractor class. |

## Internal Logic
The main execution flow involves creating a new instance of the `Contractor` class, which loads the contracts from a JSON file specified by default (or provided by the user). The key functions in this class are:

- `load()`: Loads the contracts from the specified file and returns them as a JSON object.
- `save()`: Writes the current state of the contracts to the specified file.
- `issueSpec(taskId, domain, spec)`: Issues a new spec draft for a given task ID, domain, and specification.
- `recordVeto(taskId, agentName, reason)`: Records a veto from a lead agent for a given task ID, agent name, and reason.
- `approve(taskId)`: Approves the current spec for a given task ID.
- `getSpec(taskId)`: Returns the current state of a contract with a given task ID.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system utilities. |
| `path` | Yes | Provides path manipulation utilities. |

## Side Effects
- console_output: Writes log messages to the console, including success and warning messages for issuing specs, recording vetoes, and approving specs.
- filesystem_read: Reads the contracts from a JSON file specified by default (or provided by the user) when the `load()` method is called.
- filesystem_write: Writes the current state of the contracts to a JSON file specified by default (or provided by the user) in the `save()` method.

## Dependents
No known dependents.

## Cross-References
No cross-references.
