---
source_hash: 941a0fe19169bc9d
facts_hash: 5160c899bed32c8f
generated_at: 2026-03-04T05:33:29.927Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/Agent.js

## Purpose
This file exports the `Agent` class, which represents a persistent worker in the swarm and is responsible for booting up, handling incoming messages, and sending responses to other agents. The class manages event-driven lifecycle operations critical for maintaining swarm agent orchestration.

| Export | Type | Description |
|--------|------|-------------|
| `Agent` | cjs_default | The base class for executing swarm agent workers, providing IPC messaging and autonomous lifecycle capabilities. |

## Internal Logic
The main execution flow of this file begins with the constructor, which initializes the agent's properties, sets up event listeners, and starts the boot process. The key functions include `boot()`, `listen()`, `checkForMessages()`, `_handleSingleMessage(msg)`, and `processMessage(msg)`. The `boot()` method registers the agent on the event bus, sets up heartbeat intervals, and listens for incoming messages. The `listen()` method optimizes polling by waiting for a 'new_message' signal from the Orchestrator and using IPC (Inter-Process Communication). The `checkForMessages()` function polls for unread messages every 60 seconds. The loop processes messages cleanly by awaiting `_handleSingleMessage(msg)`. The `_handleSingleMessage(msg)` asynchronously processes individual unread messages including checking system events and returning agent status to `STANDBY` or `IDLE`. The `processMessage(msg)` function handles message data passed directly to agents.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ./Logger | Yes | Provides logging functionality |
| db | No | Persistent storage event bus mapping |
| events | No | Inherits from EventEmitter |
| path | No | Scope mapping configuration |

## Side Effects
Registers process signal event listeners (`SIGTERM`, `SIGINT`) and establishes timer-based polling events (`setInterval`, `setTimeout`) that dictate system and application shutdown operations.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
