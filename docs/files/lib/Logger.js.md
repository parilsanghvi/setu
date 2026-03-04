---
source_hash: 54785071f3f30a9a
facts_hash: e90451abc517b100
generated_at: 2026-03-04T05:36:19.175Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/Logger.js

## Purpose
The Logger.js file provides a Logger class that enables logging of events in various levels (info, warn, error, debug) with customizable messages and arguments. The logger uses the console for output and can also include error objects with stack traces. The logger's methods provide a concise way to log events at different severity levels.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Logger | cjs_default | Exports a Logger class that enables logging of events in various levels and formats. |

## Internal Logic
The main execution flow involves the following key functions:
- The `_log` method is the core function responsible for logging messages at different severity levels (info, warn, error, debug). It takes level, message, and optional arguments, constructs an entry object with timestamp, log level, name, and other details, and then logs it to the console.
- The `info`, `warn`, `error`, and `debug` methods are aliasing functions that simply call the `_log` method with their respective severity levels.

## Dependencies
| Why | Import |
|-----|--------|
| - No imports detected. |

## Side Effects
- console_output: Logs messages to the console in various formats based on the log level, including error objects with stack traces.

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
