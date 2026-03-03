---
source_hash: 8120290e885e726e
facts_hash: 467ae53175989654
generated_at: 2026-03-03T07:32:50.767Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/steering-agent.js

## Purpose
This file defines a steering agent class, `SteeringAgent`, which extends the core agent class and is responsible for processing messages from users. The agent uses an LLM to simulate long-running tasks and echoes user messages back in response. When started, the agent processes incoming messages and logs signals for verification.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `echo` | method | `{ msg }` | Echoes the received message back to the user. |
| `SteeringAgent` | class | `` | A steering agent class that extends the core agent and processes messages from users. |

## Internal Logic
The main execution flow of this file is as follows:

- The `SteeringAgent` class is instantiated with its constructor, which sets up the tools and calls for the agent.
- When the agent receives a message, it logs signals to indicate tool start and end events.
- It processes the incoming message using the LLM's `generate` method, which simulates a delay and always returns a tool call to keep the loop going.
- The `echo` method is called with the received message, echoing it back to the user in response.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the core agent class foundation. |
| `../lib/db` | Yes | Enables logging of bus events for test verification. |
| `../lib/LLM` | Yes | Utilizes the LLM to simulate long-running tasks. |

## Side Effects
- console_output: The agent logs signals to indicate tool start and end events, as well as messages received from users, to the console.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
