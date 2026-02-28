---
source_hash: 7b5e768b2ba89230
facts_hash: 37f190288d447ef1
generated_at: 2026-02-25T12:04:27.706Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/SessionLogger.js

## Purpose
The `SessionLogger` class is responsible for logging events in a session-based system, storing them in a JSONL file with a unique filename per session. The logger ensures that the log directory exists and initializes a write stream for asynchronous logging. It also handles errors to prevent crashes.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `SessionLogger` | cjs_default | 
| `log` | function | Logs an event in the session log file. |
| `end` | function | Ends the logging process and calls a callback if provided. |

## Internal Logic
The main execution flow of the `SessionLogger` class involves the following key functions:
- The constructor initializes the logger by creating a unique log directory, generating a timestamp for the current session, and setting up the write stream.
- The `log` method generates a random ID for each event, creates an entry object with the ID, timestamp, and event data, and writes it to the log file using the asynchronous write stream.
- The `end` method ends the logging process by closing the write stream, which is necessary when the session is closed or terminated.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The logger outputs error messages to the console when encountering errors while writing to the log stream.
- filesystem_read: When initializing the log directory, the logger reads the file system to check if the directory exists.
- filesystem_write: The logger writes events to the log file using the asynchronous write stream.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
