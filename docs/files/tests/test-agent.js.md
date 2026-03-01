---
source_hash: 12d9faa0a2406743
facts_hash: 6594a7fa3e5d6e21
generated_at: 2026-02-25T12:18:12.362Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-agent.js

## Purpose
This file contains unit tests for the `Agent` class in the lib/Agent.js module. It verifies the initialization, booting, and heartbeat functionality of the agent. The test ensures that the agent's name, role, scope, and bus are correctly set up, and that the agent sends an initial heartbeat upon boot.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Agent` | class | `name, role, scope, bus` | Creates a new instance of the Agent class. |
| `send` | function | `sender, recipient, content, type` | Sends a message through the bus. |
| `heartbeat` | function | `name, role, pid, status` | Sends an idle heartbeat with the given parameters. |
| `getUnread` | function | `recipient` | Returns an empty array of unread messages for the specified recipient. |
| `markRead` | function | `ids` | Marks the specified message IDs as read. |

## Internal Logic
The main execution flow of this test file is as follows:

1. It creates a new instance of the `Agent` class, passing in the test agent's name, role, scope, and mock bus.
2. It verifies that the agent's properties are correctly set up by comparing them with expected values using `assert.strictEqual`.
3. It boots the agent and checks if an initial heartbeat is sent by verifying the `mockBus.heartbeats` array.
4. It restores the original `setInterval` function to prevent side effects.
5. Finally, it logs a success message or exits with an error code depending on whether the test passes.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Agent` | Yes | Provides the Agent class implementation. |
| `assert` | No | Provides assertion utilities for testing. |

## Side Effects
- console_output: The test logs success or failure messages to the console using `console.log` and `console.error`.
- filesystem_read: The test reads the existence of a folder using `fs.existsSync`, which may involve reading disk files.
- filesystem_write: The test writes temporary files and folders, including creating a new scope folder with `fs.rmdirSync`.
- global_mutation: The test modifies the global `setInterval` function using `global.setInterval = (fn, ms) => { ... }`.
- process_control: The test exits the process with an error code if the test fails using `process.exit(1)`.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
