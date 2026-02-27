---
source_hash: a672a293b1b56544
facts_hash: 94936e2b2b3696e2
generated_at: 2026-02-25T12:20:56.793Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-context.js

## Purpose
This file contains a test suite for the `contextManager` class in the `lib/Context.js` module, which manages the context of a project by reading and writing files, logging to a journal, and handling permissions and scope errors.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| contextManager | Provides methods for managing the context of a project. |
| read | Reads the content of a file in the current context. |
| write | Writes new content to a file in the current context, with optional role and scope parameters. |
| log | Logs an entry to the journal file in the current context. |

## Internal Logic
The main execution flow of this file is as follows:
- It creates a temporary directory using `fs.mkdtempSync`.
- It tests various scenarios for the `contextManager` class, including reading existing and non-existent files, writing to files with success and errors, logging to a journal.
- The tests use the `assert.strictEqual` function to verify the expected output of each method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Implements the context management functionality. |

## Side Effects
- console_output: The file outputs test results and error messages to the console using `console.log` and `console.error`.
- filesystem_read: The file reads files from the file system using `fs.readFileSync` and `fs.writeFileSync`.
- filesystem_write: The file writes new content to files on the file system using `fs.writeFileSync`.
- process_control: The file exits the process with a non-zero status code if a test fails, or continues running if all tests pass.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
