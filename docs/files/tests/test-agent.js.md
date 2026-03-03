---
source_hash: 12d9faa0a2406743
facts_hash: 025b50228a54f798
generated_at: 2026-03-03T07:33:15.499Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-agent.js

## Purpose
This file contains unit tests for the `Agent` class in the lib/Agent.js module, ensuring its proper initialization, boot functionality, and status management.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| Agent  | function | `agentName`, `agentRole`, `agentScope`, `mockBus` | Creates a new instance of the Agent class. |
| boot    | method | `agent` | Ensures folder creation and sets up the agent's status to idle. |

## Internal Logic
The test file starts by initializing the mock bus with required properties and injecting it into the Agent constructor. It then tests the initialization process, verifying that the agent's name, role, scope, and bus match the expected values.

Next, it tests the boot functionality, which creates a new folder if it doesn't exist and sets up the agent's status to idle. The test also verifies that an initial heartbeat is sent with the correct information.

Finally, the test restores the original `setInterval` function and cleans up by removing any existing folders.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes  | Provides assertions for testing. |
| path   | No   | Required for creating temporary folders. |

## Side Effects
- console_output: The test file logs success or failure messages to the console.
- filesystem_read: The test reads the existence of a folder using `fs.existsSync` and removes it using `fs.rmdirSync`.
- filesystem_write: No changes are made to the file system during this test.
- global_mutation: The test mutates the global `setInterval` function by overwriting its original implementation with a mock one.
- process_control: No control is exerted over the process during this test.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
