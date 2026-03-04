---
source_hash: 12d9faa0a2406743
facts_hash: 2b77afef8596acda
generated_at: 2026-03-04T05:52:23.027Z
generator_version: 1.0.0
model: cheap
quality_score: 73
---
# File: tests/test-agent.js

## Purpose
This file contains unit tests for the `Agent` class in the `lib/Agent.js` module, verifying its initialization, boot functionality, and status handling.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Agent` | function | `agentName, agentRole, agentScope, bus` | Creates a new instance of the Agent class. |
| `boot` | method | `()` | Initializes and sets up the agent's scope and boot process. |

## Internal Logic
The main execution flow of this file consists of the following steps:

1. Initialization: The test creates a new instance of the `Agent` class, injecting it with mock data for testing purposes.
2. Boot: The test calls the `boot` method on the agent instance, which sets up the scope and boot process.
3. Verification: The test verifies that the agent's status is set to "IDLE" after booting and that an initial heartbeat was sent.

The key functions in this file are:

* `Agent`: The constructor function of the Agent class, which initializes the agent's state.
* `boot`: A method on the Agent class, which sets up the scope and boot process.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Agent` | Yes | Provides the implementation of the Agent class. |
| `assert` | No | Used for assertions to verify test results. |

## Side Effects
- console_output: The file logs messages to the console, including success and failure indicators.
- filesystem_read: The file reads the existence of files on disk to determine if a scope exists or not.
- filesystem_write: The file writes data to files on disk as part of the scope creation process.
- global_mutation: The file modifies the `global.setInterval` function to prevent hanging during testing.
- process_control: The file controls the exit status of the process based on test results.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](../lib/Agent.js.md)
