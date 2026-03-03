---
source_hash: fbe08e7791c992d4
facts_hash: 7d2151dacc4fa39c
generated_at: 2026-03-03T07:15:09.237Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/Context.js

## Purpose
This file provides a `ContextManager` class that manages the context of an application, including reading and writing to files, logging activities, and enforcing permissions based on agent roles and scopes.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| ContextManager | cjs_default | Creates a new instance of the ContextManager class. |

## Internal Logic
The `ContextManager` class is initialized with a constructor that sets up a logger instance. The main execution flow involves reading and writing to files, logging activities, and enforcing permissions based on agent roles and scopes.

- The `read` method reads context from a directory file named `CONTEXT.md`.
- The `write` method writes to the same file, but only if the agent is a lead of the scope and has permission.
- The `log` method appends entries to a journal file named `JOURNAL.md`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides file system operations. |
| path | No | Provides path manipulation utilities. |
| ./Logger | Yes | Provides logging functionality for the ContextManager class. |

## Side Effects
- `filesystem_read`: Reads context from a directory file, returning null if the file does not exist.
- `filesystem_write`: Writes to the `CONTEXT.md` file, throwing an error if the agent is not a lead of the scope or has permission.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
