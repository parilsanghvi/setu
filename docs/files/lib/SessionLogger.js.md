---
source_hash: 7b5e768b2ba89230
facts_hash: d6e4fdfc62ec9739
generated_at: 2026-03-03T07:16:51.406Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/SessionLogger.js

## Purpose
This file provides a SessionLogger class that logs events asynchronously to a JSONL formatted file, ensuring consistent session IDs across the process lifetime.

| Export | Type | Description |
|--------|------|-------------|
| `SessionLogger` | cjs_default | Exports the SessionLogger class for use in other modules |

## Internal Logic
The main execution flow of the SessionLogger involves creating a write stream to log events, handling errors and backpressure, and writing logs to disk.

### Key Functions

- **constructor**: Initializes the SessionLogger instance with an agent name, creates a timestamped file path, and sets up the write stream.
- **log**: Writes a new event log entry to the asynchronous write stream, including a generated ID, timestamp, and any additional event data.
- **end**: Closes the write stream when called.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities for directory creation and stream operations |
| `path` | No | Provides path manipulation functions for constructing file paths |

## Side Effects

- **console_output**: The SessionLogger logs any errors that occur during write operations to the console, providing debugging information.
- **filesystem_read**: There are no explicit filesystem read operations in this module; however, the creation of log files may involve reading directory contents to ensure the directory exists before creating it.
- **filesystem_write**: The SessionLogger writes log events to a JSONL formatted file, which is created and managed by the class's constructor and write method.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
