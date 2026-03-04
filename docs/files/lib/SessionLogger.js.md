---
source_hash: 7b5e768b2ba89230
facts_hash: eff11869170b865b
generated_at: 2026-03-04T05:36:43.323Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/SessionLogger.js

## Purpose
The SessionLogger.js file exports a class called SessionLogger, which is responsible for logging events in an asynchronous manner, storing them in JSONL format, and handling errors. The class takes an agent name as a parameter in its constructor. It also creates a log directory if it doesn't exist and ensures that the log files are stored in a consistent format.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `SessionLogger` | cjs_default | Exports the SessionLogger class, allowing users to create instances of it for logging events. |

## Internal Logic
The constructor initializes the SessionLogger instance with an agent name and creates a log file path based on the current timestamp. It also sets up a write stream for asynchronous logging and handles errors that may occur during this process.

The `log` method takes an event object as input, generates a random ID for it if necessary, and writes the event to the log file in JSONL format. If there is an error during writing, it catches the exception and logs a message to the console.

The `end` method closes the write stream when called, stopping any ongoing logging activity.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system functions for creating directories and working with files. |
| `path` | No | Provides path manipulation functions for joining directory paths and checking their existence. |

## Side Effects
- console_output: The class logs error messages to the console when an exception occurs during logging.
- filesystem_read: The class does not perform any file system reads, but it does create a log file if one doesn't exist.
- filesystem_write: The class writes events to the log file in JSONL format using the `fs.createWriteStream` function.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
