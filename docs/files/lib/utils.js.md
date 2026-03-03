---
source_hash: 63f3b8611c3852ff
facts_hash: 40d30035bac347ea
generated_at: 2026-03-03T07:27:21.755Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/utils.js

## Purpose
This file exports two functions, `readLastLines` and `estimateJsonLength`, which are used to efficiently read the last N lines of a file without loading the entire file into memory, and estimate the JSON string length of a value without serialization respectively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `readLastLines` | cjs_named | Reads the last N lines of a file efficiently. |
| `estimateJsonLength` | cjs_named | Estimates the JSON string length of a value without serialization. |

## Internal Logic
The main execution flow of this file is as follows:

- The `readLastLines` function opens the specified file in read mode and gets its stats.
- It then reads chunks from the end of the file until it has enough newlines or hits the start of the file.
- After that, it splits the content into lines and returns the last N lines.
- The `estimateJsonLength` function uses recursion to estimate the JSON string length of a value by counting the number of characters required for each type.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs/promises` | No | Provides promise-based file system functionality. |

## Side Effects
- console_output: Errors are logged to the console with the error message and the file path, and an empty array is returned in case of errors or if the file does not exist.

## Dependents
- [index.js](../index.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)

## Cross-References
- [index.js](../index.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)
