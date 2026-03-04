---
source_hash: d2517338efc5ac61
facts_hash: 310092b1d64e0581
generated_at: 2026-03-04T05:33:47.483Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/AgentContextManager.js

## Purpose
This file defines the `AgentContextManager` class, which is responsible for managing the context of a Core Agent instance. It provides methods to estimate the token count of the current context and to compact the context by summarizing key messages.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `estimateTokenCount` | function | Estimates the token count of the current context by counting characters in role names and content |
| `compactContext` | async function | Compacts the context by summarizing key messages and reducing the number of messages to preserve only essential information |
| `estimateJsonLength` | function | Recursively estimates the JSON string length of a value without serialization |

## Internal Logic
The main execution flow involves the following steps:

1. The `compactContext` method is called when the estimated token count exceeds the context compaction threshold.
2. It first checks if the estimated token count is below the threshold and returns early if so.
3. It then estimates the token count using the `estimateTokenCount` method.
4. If the estimated token count is above the threshold, it proceeds to compact the context by summarizing key messages.
5. The `compactContext` method uses the `estimateJsonLength` method to estimate the JSON string length of each message's role name and content.
6. It then creates a summary prompt using the `LLM.generate` method from the `./LLM` module.
7. The summarized conversation is then combined with the preserved messages to form the compacted context.
8. Finally, it logs the compaction event and emits the 'context_compact_start' and 'context_compact_end' events.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Config` | Yes | Provides the context compaction threshold value |
| `./LLM` | Yes | Provides the LLM.generate method to generate summary prompts |

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Config.js](./Config.js.md)
- [LLM.js](./LLM.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
