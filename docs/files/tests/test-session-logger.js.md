---
source_hash: ae6e8b17f7f2f87f
facts_hash: d060c957cdae88cb
generated_at: 2026-03-03T07:47:18.501Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-session-logger.js

## Purpose
This file tests the functionality of the `SessionLogger` class, specifically its async logging capabilities. It creates a logger instance, logs messages, and verifies that the log entries are written to disk. The test also checks multiple log entries.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `SessionLogger` | function |  | Creates a new instance of the SessionLogger class. |
| `log` | function | `message` | Logs a message to the log file. |
| `end` | function | `callback` | Ends the logger's stream and flushes any pending data. |

## Internal Logic
The main execution flow starts by creating a new instance of the `SessionLogger` class, passing the `AGENT_NAME` as an argument. The `log` method is then used to log a message to the log file, followed by calling the `end` method to flush any pending data and wait for the file creation to complete.

The test creates a second logger instance with a suffix (`_2`) and logs multiple messages using the `log` method. After all log messages have been written, the `end` method is called on both logger instances to ensure that any remaining data is flushed to disk.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/SessionLogger` | Yes | Provides the functionality for logging and flushing data. |
| `fs` | No | Used for interacting with the file system, including reading and writing log files. |

## Side Effects
- console_output: The test logs messages to the console using `console.log`, which displays the log output.
- filesystem_read: The test reads the contents of a log file using `fs.readFileSync` to verify its contents match expectations.
- filesystem_write: The test writes data to a log file using `logger.log` and `fs.writeFileSync` (not shown in this code snippet).
- process_control: The test exits the process with an error code of 1 if the log file is not found, using `process.exit`.

## Dependents
No known dependents.

## Cross-References
- [SessionLogger.js](../lib/SessionLogger.js.md)
