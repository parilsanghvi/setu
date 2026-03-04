---
source_hash: 941a0fe19169bc9d
facts_hash: 5160c899bed32c8f
generated_at: 2026-03-04T05:33:29.927Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: lib/Agent.js

## Purpose
This file exports the `Agent` class, which represents a persistent worker in the swarm and is responsible for booting up, handling incoming messages, and sending responses to other agents.

| Export | Type | Description |
|--------|------|-------------|
| `Agent` | cjs_default | 

## Internal Logic
The main execution flow of this file begins with the constructor, which initializes the agent's properties, sets up event listeners, and starts the boot process. The key functions include `boot()`, `listen()`, `checkForMessages()`, and `processMessage(msg)`. The `boot()` method registers the agent on the event bus, sets up heartbeat intervals, and listens for incoming messages. The `listen()` method optimizes polling by waiting for a 'new_message' signal from the Orchestrator and using IPC (Inter-Process Communication). The `checkForMessages()` function polls for unread messages every 60 seconds and processes them when received. The `processMessage(msg)` function handles system events, user messages, and sends responses to other agents.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ./Logger | Yes | Provides logging functionality |
| db | No | 
| events | No | 
| path | No | 

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
