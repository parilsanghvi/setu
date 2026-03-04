---
source_hash: a672a293b1b56544
facts_hash: c2bc8dc1ccaaf59d
generated_at: 2026-03-04T05:55:28.119Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-context.js

## Purpose
This file tests the functionality of the `contextManager` class, which is responsible for managing and writing context data to files within a specified scope. The test suite covers various scenarios, including reading existing contexts, writing new contexts, logging to a journal, and handling permission and scope errors.

## Exports / API Surface

| Export | Description |
|--------|-------------|
| `contextManager` | Provides methods for managing context data. |

## Internal Logic
The main execution flow of this file is as follows:
- It creates a temporary directory using the `fs.mkdtempSync` method.
- It tests various scenarios, including reading existing contexts, writing new contexts, logging to a journal, and handling permission and scope errors.

Key functions used in this file include:
- `contextManager.read(tempDir)`: Reads the content of an existing context file within the specified directory.
- `contextManager.write(leadAgent, tempDir, newContent)`: Writes new context data to an existing context file within the specified directory for a given agent.
- `contextManager.log(logAgent, tempDir, logEntry)`: Logs a message to a journal file within the specified directory for a given agent.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Defines the context management functionality. |
| `assert` | No | Used for assertions in testing. |

## Side Effects
- console_output: The file logs various messages to the console, including test status updates and error messages.
- filesystem_read: The file reads files from the specified temporary directory using the `fs.readFileSync` method.
- filesystem_write: The file writes new context data to existing context files within the specified directory using the `contextManager.write` method.
- process_control: The file exits the process with a non-zero status code if an error occurs during testing.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
