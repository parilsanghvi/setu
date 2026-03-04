---
source_hash: 63f3b8611c3852ff
facts_hash: 5ef6dc1ce775e1fe
generated_at: 2026-03-04T05:46:56.465Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/utils.js

## Purpose
This file provides two utility functions: `readLastLines` and `estimateJsonLength`. The `readLastLines` function efficiently reads the last N lines of a file without loading the entire file into memory, while the `estimateJsonLength` function recursively estimates the JSON string length of a value without serialization.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `readLastLines` | cjs_named | Returns an array of lines from the end of a file. |
| `estimateJsonLength` | cjs_named | Estimates the JSON string length of a value without serialization. |

## Internal Logic
The main execution flow of `readLastLines` involves:
- Opening the specified file in read mode.
- Checking if the file is empty or has no newlines, returning an empty array if so.
- Reading chunks from the end of the file until it reaches the desired number of newlines or hits the start of the file.
- Splits the content into lines and returns the last `maxLineCount` lines.

Key functions:
- `fs.open`: Opens a file in read mode.
- `fileHandle.stat`: Gets the stats of the opened file handle.
- `fileHandle.close`: Closes the file handle.
- `Buffer.alloc`: Allocates memory for a buffer.
- `read(buffer, offset, length, position)`: Reads from the file handle into a buffer.

The `estimateJsonLength` function involves:
- Checking if the input value is null or undefined and returning the corresponding length.
- Checking if the input value is a string and returning its length plus 2 (for the "string" keyword).
- Checking if the input value is a number and returning its length as a string.
- Checking if the input value is a boolean and returning 4 for true and 5 for false.
- If the input value is an array, recursively estimating the JSON length of each item and adding 2 (for the "[]" keyword) and commas.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs/promises` | No | Provides asynchronous file I/O operations. |

## Side Effects
- console_output: The function logs an error message to the console if there's an issue reading the log file, but it doesn't directly output anything else.

## Dependents
- [index.js](../index.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)

## Cross-References
- [index.js](../index.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)
