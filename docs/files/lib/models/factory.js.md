---
source_hash: 0986dcc427ca5f6a
facts_hash: e05ba6846e55180e
generated_at: 2026-02-25T12:07:42.266Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/models/factory.js

## Purpose
This file defines a factory class `ProviderFactory` that creates instances of different provider classes, such as OpenAIProvider, AnthropicProvider, and GoogleProvider. The factory class uses configuration settings from the ModelConfig class to resolve URLs and other settings for each provider. It also handles authentication using the ProfileManager class.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Exports a new instance of the ProviderFactory class |
| `create` | function | Creates an instance of a provider class based on the provided provider ID and model name |

## Internal Logic
The main execution flow of this file is as follows:

* The `ProviderFactory` class is instantiated, which sets up an object `providers` that maps provider IDs to their corresponding classes.
* The `create` method is called with a provider ID, a model name, and optional override configuration. This method:
	+ Resolves the authentication settings for the provider using the ProfileManager class.
	+ Resolves the base URL configuration for the provider using the ModelConfig class.
	+ Merges any environment variable overrides for the base URL into the provider's configuration.
	+ Instantiates a new instance of the provider class, passing in the resolved configuration and model name.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../auth/profile-mgr` | Yes | Provides authentication functionality |
| `./config` | Yes | Provides configuration settings for providers |
| `./providers/anthropic` | Yes | Implements the Anthropic provider class |
| `./providers/google` | Yes | Implements the Google provider class |
| `./providers/ollama` | Yes | Implements the Ollama provider class |
| `./providers/openai` | Yes | Implements the OpenAI provider class |

## Side Effects
* console_output: The file logs a warning message to the console if no authentication settings are found for some providers.
* env_access: The file accesses environment variables, specifically `BASE_URL` and other provider-specific variables, to override configuration settings.

## Dependents
No known dependents.

## Cross-References
- [profile-mgr.js](../auth/profile-mgr.js.md)
- [config.js](./config.js.md)
- [anthropic.js](./providers/anthropic.js.md)
- [google.js](./providers/google.js.md)
- [ollama.js](./providers/ollama.js.md)
- [openai.js](./providers/openai.js.md)
