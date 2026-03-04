---
source_hash: 8120290e885e726e
facts_hash: d323879fdaa5b8ef
generated_at: 2026-03-04T05:51:58.539Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: tests/steering-agent.js

## Purpose
This file tests the steering agent, a bot class that processes incoming messages and responds accordingly. The steering agent simulates a long-running task by mocking an LLM (Large Language Model) and echoing user input back to them.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `LLM.generate` | function | `{ prompt, messages, type, tools }` | Simulates generating a response from the LLM. |
| `SteeringAgent` | class | `` | 

## Internal Logic
The main execution flow of this file is as follows:
1. The steering agent is created and attached to an event bus.
2. When a tool start event occurs, it logs a signal to the console.
3. The steering agent processes an incoming message, which triggers its `processMessage` function.
4. In the `processMessage` function, the steering agent checks if a long-running task should be started and simulates a delay using the mocked LLM's `generate` function.
5. After the delay, it echoes the user input back to them.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides a base class for agents in the system. |
| `../lib/db` | Yes | Manages database events and signals. |
| `../lib/LLM` | Yes | Simulates long-running tasks with its generated response. |

## Side Effects
- console_output: The steering agent logs various signals to the console, including when a tool start or end event occurs.
- console_output: When the steering agent processes an incoming message, it logs the content of the message to the console if the `message` event is emitted by the bus.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
