---
source_hash: 54785071f3f30a9a
facts_hash: 62a66688688669f1
generated_at: 2026-02-25T12:04:03.661Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/Logger.js

## Purpose
The Logger file exports a class named `Logger` that provides logging functionality for the system, allowing developers to log different types of messages at various levels such as info, warn, error, and debug.

| Export | Type | Description |
|--------|------|-------------|
| `info` | function | Logs an info message with the provided arguments. |
| `warn` | function | Logs a warn message with the provided arguments. |
| `error` | function | Logs an error message with the provided arguments, also handling any Error objects. |
| `debug` | function | Logs a debug message with the provided arguments. |
| `Logger` | cjs_default | Exports the Logger class for use in the system. |

## Internal Logic
The main execution flow of the Logger class involves the `_log` method, which takes a log level and a message along with any additional arguments.

- The constructor initializes the logger's name.
- The `_log` method constructs an entry object with the timestamp, log level, logger name, and message. It then checks if there are any Error objects or other non-Error arguments and adds them to the entry accordingly.
- Depending on the log level, it logs the formatted entry as either a console error or a console log.

## Dependencies
| Export | Type | Why |
|--------|------|-----|
| console | global | Provides access to the console object for logging output. |

## Side Effects
- console_output: The Logger class writes log messages directly to the console, producing output that can be seen in the terminal or command prompt.

## Dependents
- [Agent.js](./Agent.js.md)
- [Pariksha.js](./Pariksha.js.md)
- [server.js](./server.js.md)

## Cross-References
- [Agent.js](./Agent.js.md)
- [Pariksha.js](./Pariksha.js.md)
- [server.js](./server.js.md)
