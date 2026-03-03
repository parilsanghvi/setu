---
source_hash: af4c9762950841c0
facts_hash: 6faf88c6e4600448
generated_at: 2026-03-03T07:31:36.046Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/core_agent_upgrade.test.js

## Purpose
This file contains a test suite for the CoreAgent class, specifically testing its upgrade functionality and validation logic.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `CoreAgent` | function |  | Creates a new instance of the CoreAgent class. |
| `LLM.generate` | method | system, messages, effort, tools | Returns simulated data from the LLM. |
| `z.object` | method | schema | Validates and sanitizes user input. |

## Internal Logic
The main execution flow of this file is as follows:
- The `runTest` function creates a new instance of the CoreAgent class with mock tools and messages.
- It sets up event listeners to track various events during the conversation.
- It processes a message through the agent, simulating a user's input.
- It verifies that the correct events are triggered in the correct order.
- It tests validation failure by returning invalid data from the LLM.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Implements conversation logic. |
| `../lib/LLM` | Yes | Provides simulated data for testing. |
| `zod` | No | Validates user input. |

## Side Effects
- console_output: The test suite logs messages to the console indicating progress and verification results.
- process_control: If a test fails, the process exits with a non-zero status code.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [LLM.js](../lib/LLM.js.md)
