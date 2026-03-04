---
source_hash: e0fae7068e1b8395
facts_hash: 1f09b6a80a5a199f
generated_at: 2026-03-04T05:36:10.093Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: lib/LLM.js

## Purpose
This file exports a class named `LLM` that implements a cascading fallback mechanism for generating content using different AI models, with concurrency limits to prevent overloading.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| LLM    | cjs_default | Provides an interface for generating content using various AI models. |

## Internal Logic
The main execution flow of the `LLM` class is as follows:
- The constructor initializes default providers and sets up concurrency limits.
- The `getProvider` method retrieves or creates a provider instance based on the provided alias.
- The `registerProvider` method registers a new provider instance with the given alias.
- The `generate` method generates content using the specified model alias, with cascading fallback to cheaper models if necessary.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ProviderFactory    | Yes | Creates instances of AI providers. |
| Config              | Yes | Defines configuration settings for the LLM. |

## Side Effects
- console_output: The `LLM` class logs success messages, error messages, and rate limit warnings to the console.
- console_error: The `registerProvider` method logs errors when creating or registering a provider instance.
- cooldown: When both expensive and cheap models are rate-limited, the `generate` method enters a cooldown period before retrying.
- console_degradation: In case of a crash loop, the `generate` method returns a degradation message instead of throwing an error.

## Dependents
- [AgentContextManager.js](./AgentContextManager.js.md)
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Config.js](./Config.js.md)
- [factory.js](./models/factory.js.md)
- [AgentContextManager.js](./AgentContextManager.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
