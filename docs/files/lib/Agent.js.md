---
source_hash: 941a0fe19169bc9d
facts_hash: b690555c5a97cc4c
generated_at: 2026-03-03T07:13:52.560Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: lib/Agent.js

## Purpose
The Agent.js file defines a persistent worker class in the swarm, responsible for handling messages and updates from the Orchestrator while maintaining its own state and heartbeat.

| Export | Type | Description |
|--------|------|-------------|
| `Agent` | cjs_default | Exports the Base Agent Class |

## Internal Logic
The main execution flow of the Agent class involves:
- Initializing the agent's state in the constructor
- Booting up the agent by registering itself with the bus, setting up heartbeat intervals, and listening for messages
- Listening for new messages from the Orchestrator, processing them, and updating its status accordingly

Key functions include:
- `boot()`: Initializes the agent's state and sets up the necessary listeners and intervals
- `listen()`: Sets up the IPC handler and initial checks for messages
- `checkForMessages()`: Polls for new messages from the Orchestrator at regular intervals
- `_setIdle()`: Resets the agent's status to idle when no messages are found

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality for the agent |
| `events` | No | Enables event handling capabilities |
| `path` | No | Provides path manipulation utilities |

## Side Effects

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
