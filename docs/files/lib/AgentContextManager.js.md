---
source_hash: d2517338efc5ac61
facts_hash: 64357a6f7338a634
generated_at: 2026-03-03T07:14:06.160Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/AgentContextManager.js

## Purpose
The AgentContextManager class is responsible for managing the context of an agent, including compacting and summarizing conversations to reduce memory usage. It estimates token counts, compacts contexts, and logs events related to these operations.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `AgentContextManager` | cjs_default | Exposes the AgentContextManager class for use by other parts of the system. |

## Internal Logic
The main execution flow involves the following key functions:

*   The `estimateTokenCount()` method estimates the total number of tokens in the current context, taking into account message roles, content, and tool calls.
*   The `compactContext()` method compacts the conversation by summarizing the most important parts and discarding redundant information.
*   The `estimateJsonLength(obj)` function recursively estimates the JSON string length of a value without serialization.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Config` | Yes | Provides configuration settings used in compacting contexts. |
| `./LLM` | Yes | Offers language model capabilities for generating summaries. |

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Config.js](./Config.js.md)
- [LLM.js](./LLM.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
