---
source_hash: 617ca610afd41bdb
facts_hash: 7919fa54841e062a
generated_at: 2026-03-04T05:56:40.045Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-core-agent-security.js

## Purpose
This file tests the security features of the CoreAgent class, specifically path traversal protection and file system access control.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (), getUnread: () => [], markRead: () => {}, send: () => {} }` | Mocks the bus with a set of stub functions. |
| `mockLLM` | arrow | `{ generate: async () => "Mock Response" }` | Mocks an LLM with a generated response. |
| `CoreAgent` | function | `` | Exports the CoreAgent class for testing and use. |

## Internal Logic
The main execution flow of this file is as follows:
- The `runTest` function is called, which creates a safe scope for testing.
- It instantiates a new instance of the `CoreAgent` class with a specific path.
- The agent's methods are tested by reading and writing files outside the safe scope.

The key functions in this file are:
- `require`: A custom implementation that overrides the original require function to mock dependencies.
- `CoreAgent`: The class being tested, which provides methods for reading and writing files.
- `runTest`: The main test function that orchestrates the testing process.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities. |
| `module` | No | Provides the require function. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The test output is printed to the console, including success or failure messages and error details.
- filesystem_read: Files are read from the file system during testing.
- filesystem_write: Files are written to the file system during testing.
- process_control: The `process.exit(1)` function is called to exit the process with a non-zero status if tests fail.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
