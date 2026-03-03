---
source_hash: 54785071f3f30a9a
facts_hash: 2fbb8ea2ca932d81
generated_at: 2026-03-03T07:16:27.954Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/Logger.js

## Purpose
The `Logger.js` file exports a `Logger` class that provides logging functionality for different log levels (info, warn, error, debug) and can include additional arguments such as errors and other data. This class allows developers to easily log messages with varying levels of severity and optional data. The logger outputs logs to the console.

## Exports / API Surface
| Export | Type | Description |
| Logger | cjs_default | Exports a `Logger` class for logging messages with different log levels. |

## Internal Logic
The main execution flow of the `Logger.js` file involves creating a new instance of the `Logger` class, which stores its name and provides methods to log messages with specific log levels. The `_log` method is the core function that formats and outputs log entries based on the provided level, message, and additional arguments.

## Dependencies
| Why | Description |
| None | No dependencies are required for logging functionality. |

## Side Effects
- console_output: The logger outputs logs to the console, with error messages printed to `console.error` and other logs printed to `console.log`.

## Dependents
- [Agent.js](./Agent.js.md)
- [Camera.js](./Camera.js.md)
- [Context.js](./Context.js.md)
- [Docker.js](./Docker.js.md)
- [Pariksha.js](./Pariksha.js.md)
- [SkillLoader.js](./SkillLoader.js.md)
- [server.js](./server.js.md)

## Cross-References
- [Agent.js](./Agent.js.md)
- [Camera.js](./Camera.js.md)
- [Context.js](./Context.js.md)
- [Docker.js](./Docker.js.md)
- [Pariksha.js](./Pariksha.js.md)
- [SkillLoader.js](./SkillLoader.js.md)
- [server.js](./server.js.md)
