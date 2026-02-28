---
source_hash: 94c25056b3364cb1
facts_hash: 13d9813f11dd3bd8
generated_at: 2026-02-25T12:04:50.254Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/SwarmProtocol.js

## Purpose
This file defines a standardized workflow handoff protocol for task orchestration, providing message types and constants for tasks, status updates, and helper functions. It exports the `Protocol` object, which contains the standardized message types, as well as the `createMessage` function for formatting message objects. The protocol enables efficient communication between managers and workers in a swarm system.

| Export | Type | Description |
|--------|------|-------------|
| Protocol | cjs_default | Exports the standardized workflow handoff protocol. |
| createMessage | function | Creates a formatted message object with the specified type, content, and metadata. |

## Internal Logic
The main execution flow of this file involves defining the `Protocol` object, which contains various constants for task lifecycle events (TASK_ASSIGN, TASK_ACK, etc.) and status updates (STATUS_UPDATE). The `createMessage` function is used to format message objects with the specified type, content, and metadata. This protocol enables standardized communication between managers and workers in a swarm system.

## Dependencies
| Import | Why |
|--------|------|
| None |

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
