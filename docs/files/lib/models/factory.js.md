---
source_hash: 0986dcc427ca5f6a
facts_hash: d515adfdd956c7ab
generated_at: 2026-03-03T07:20:25.807Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/models/factory.js

## Purpose
The `factory.js` file is responsible for creating instances of different provider classes, which are used to interact with various AI models. It provides a centralized way to manage the creation and configuration of these providers. The `ProviderFactory` class uses the `ProfileManager` to resolve authentication keys and the `ModelConfig` to resolve base URLs for each provider.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Creates a new instance of the ProviderFactory class. |

## Internal Logic
The main execution flow of the `factory.js` file is as follows:

1. The `ProviderFactory` constructor initializes an object `providers` that maps provider IDs to their corresponding classes.
2. The `create` method takes in a provider ID, model name, and optional override configuration. It:
	* Resolves authentication keys using the `ProfileManager`.
	* Resolves base URLs for each provider using the `ModelConfig`.
	* Merges environment variable overrides for base URLs.
	* Instantiates a new instance of the corresponding provider class, passing in the resolved configuration and authentication key.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../auth/profile-mgr` | Yes | Provides helper utilities for resolving authentication keys. |
| `./config` | Yes | Offers functions to resolve base URLs for each provider. |
| `./providers/anthropic` | Yes | Defines a class implementing a specific AI model provider. |
| `./providers/google` | Yes | Defines a class implementing another specific AI model provider. |
| `./providers/ollama` | Yes | Defines a class implementing yet another specific AI model provider. |
| `./providers/openai` | Yes | Defines a class implementing the OpenAI-compatible AI model provider. |

## Side Effects
- console_output: The file logs a warning message to the console if no authentication key is found for some providers, but this can be suppressed by commenting out or removing the line.
- env_access: The file accesses environment variables to override base URLs for some providers.

## Dependents
No known dependents.

## Cross-References
- [profile-mgr.js](../auth/profile-mgr.js.md)
- [config.js](./config.js.md)
- [anthropic.js](./providers/anthropic.js.md)
- [google.js](./providers/google.js.md)
- [ollama.js](./providers/ollama.js.md)
- [openai.js](./providers/openai.js.md)
