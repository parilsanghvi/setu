---
source_hash: 893051948440889c
facts_hash: 3124276f07f6960f
generated_at: 2026-02-25T12:02:44.621Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/Context.js

## Purpose
The ContextManager class in this file is responsible for managing the context of an application, allowing agents to read and write to specific directories while enforcing permission checks based on their role and scope.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `ContextManager` | cjs_default | Creates a new instance of the ContextManager class. |

## Internal Logic
The ContextManager class has three main methods: read, write, and log. The constructor is not explicitly defined.

- The `read` method reads the context file from a specified directory path.
- The `write` method writes to the CONTEXT.md file in a specified directory if the agent owning the scope is a lead.
- The `log` method appends a new entry to the JOURNAL.md file in a specified directory.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides functions for interacting with the file system. |
| `path` | No | Provides utilities for working with file paths. |

## Side Effects

- console_output: The `console.log` statements in the write and log methods output messages to the console.
- filesystem_read: The `readFileSync` method in the read and log methods reads files from the file system.
- filesystem_write: The `writeFileSync` method in the write method writes files to the file system.

## Dependents
No known dependents.

## Cross-References
No cross-references.
