---
source_hash: fbe08e7791c992d4
facts_hash: beb07486117be8a3
generated_at: 2026-03-04T05:34:55.839Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/Context.js

## Purpose
The ContextManager class is responsible for managing and updating context files, logging agent activities, and enforcing permissions based on the agent's role and scope.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| read | function | Returns the contents of a context file from a specified directory. |
| write | function | Writes new content to the CONTEXT.md file in a specified directory, enforcing permission checks based on the agent's role and scope. |
| log | function | Appends a new log entry to the JOURNAL.md file in a specified directory, open to all agents. |

## Internal Logic
The main execution flow of the ContextManager class involves:

*   Reading context files from directories using the `read` method.
*   Writing new content to CONTEXT.md files in directories while enforcing permission checks using the `write` method.
*   Appending log entries to JOURNAL.md files in directories using the `log` method.

Key functions include:

*   The constructor initializes a Logger instance for logging purposes.
*   The `read` method reads the contents of a context file from a specified directory.
*   The `write` method writes new content to the CONTEXT.md file in a specified directory, enforcing permission checks based on the agent's role and scope.
*   The `log` method appends a new log entry to the JOURNAL.md file in a specified directory.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides file system operations. |
| path | No | Provides path manipulation utilities. |
| ./Logger | Yes | Supplies logging functionality for the ContextManager class. |

## Side Effects

*   filesystem_read: The `read` method reads the contents of a context file from disk, storing the result in memory.
*   filesystem_write: The `write` method writes new content to the CONTEXT.md file on disk, overwriting any existing file.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
