---
source_hash: 8120290e885e726e
facts_hash: 4d78dae405d0fba1
generated_at: 2026-02-25T12:17:44.449Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/steering-agent.js

## Purpose
This file defines a testing module for the SteeringBot, simulating long-running tasks using a mock LLM and logging bus events for verification. It exports the `SteeringAgent` class, which extends the `CoreAgent` class, and provides tools for the bot to interact with users. The test code creates an instance of the `SteeringAgent` class and starts a loop to process incoming messages.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| SteeringAgent | class | `` | Exports the SteeringBot class, which extends CoreAgent. |
| LLM | module | `` | Provides a mock LLM for simulating long-running tasks. |
| bus | module | `` | Manages and logs bus events for testing verification. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `LLM.generate` function is mocked to simulate a delay and always returns a tool call, keeping the loop going.
2. The `SteeringAgent` class extends the `CoreAgent` class and sets up tools for the bot.
3. An instance of the `SteeringAgent` class is created and bound to the `bot` variable.
4. The `bot` object listens for events such as `tool_start` and `tool_end`, logging messages to the console.
5. A message is sent to the bot, starting a long task simulation using the mocked LLM.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| LLM | Yes | Facilitates testing of long-running tasks. |
| CoreAgent | No | Serves as a base class for SteeringBot functionality. |
| bus | No | Manages and logs bus events for testing verification. |

## Side Effects
- console_output: The test code logs messages to the console when the `tool_start` and `tool_end` events are triggered, indicating that these events have occurred.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
