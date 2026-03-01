---
source_hash: 04916efddc72f345
facts_hash: 2012f1297878e4b5
generated_at: 2026-02-25T12:13:09.745Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: lib/utils.js

## Purpose
The lib/utils.js file exports a single function, `readLastLines`, which efficiently reads the last N lines of a file without loading the entire file into memory.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| readLastLines | cjs_named | Reads the last N lines of a file. |

## Internal Logic
The `readLastLines` function works as follows:
- It opens the specified file in read mode.
- It checks if the file is empty and returns an empty array if so.
- It reads chunks from the end of the file until it has enough newlines or reaches the start of the file.
- It checks for safety breaks: if the chunk size exceeds 1MB, it stops to prevent memory issues.
- It closes the file handle in the `finally` block.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides asynchronous file system operations |
| console | Yes | Provides logging functionality |

## Side Effects
- console_output: The function logs an error message to the console if there is an issue reading the log file.

## Dependents
- [index.js](../index.js.md)
- [server.js](./server.js.md)

## Cross-References
- [index.js](../index.js.md)
- [server.js](./server.js.md)
