---
source_hash: e0fae7068e1b8395
facts_hash: 652de46af1f3c1a7
generated_at: 2026-02-25T12:03:53.865Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/LLM.js

## Purpose
This file defines the LLM (Large Language Model) class, which is responsible for generating content using a specific model alias or provider type. The class implements cascading fallback to expensive -> cheap -> cooldown wait -> retry cheap models. It also limits concurrency to prevent excessive usage.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| LLM | cjs_default | Creates a new instance of the LLM class for generating content using a specific model alias or provider type. |
| getProvider | function | Retrieves a provider instance based on the provided alias. |
| registerProvider | function | Registers a new provider instance with the specified alias and options. |

## Internal Logic
The main execution flow of this file involves creating an instance of the LLM class, which initializes default providers for expensive and cheap models. The `generate` method is then called to produce content using a specific model alias or provider type.

Key functions include:
- `_acquireSlot`: Acquires a slot in the concurrency queue.
- `_releaseSlot`: Releases a previously acquired slot in the concurrency queue.
- `_generateInternal`: Performs the actual content generation using the specified model and provider instance.
- `initializeDefaults`: Initializes default providers for expensive and cheap models.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ProviderFactory | Yes | Provides a factory function for creating new provider instances. |
| Config | Yes | Supplies configuration settings, including the default model providers and names. |

## Side Effects
- `console.log` and `console.error`: Used to output messages to the console indicating success or failure of initialization and operation.
- `_cooldownUntil` variable: Set when a rate limit is exceeded, causing the application to wait for a specified amount of time before retrying.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Config.js](./Config.js.md)
- [factory.js](./models/factory.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
