---
source_hash: 94c25056b3364cb1
facts_hash: 7b14a978e4a2895a
generated_at: 2026-03-04T05:37:04.699Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/SwarmProtocol.js

## Purpose
This file defines a standardized workflow handoff protocol for task orchestration, specifically the `Protocol` object which contains message types and constants for assignment, acknowledgement, completion, and failure, as well as status updates.

| Export | Type | Description |
|--------|------|-------------|
| Protocol | cjs_default | Exports the standardized workflow handoff protocol |

## Internal Logic
The main execution flow of this file involves creating a `Protocol` object with predefined message types and constants. The `createMessage` function is used to format message objects with specific types, content, and metadata.

| Function | Description |
|----------|-------------|
| createMessage | Formats a message object with the specified type, content, and optional metadata |

## Dependencies
No imports are detected in this file.

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
