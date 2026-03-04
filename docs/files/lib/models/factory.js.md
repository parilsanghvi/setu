---
source_hash: 0986dcc427ca5f6a
facts_hash: d094afe792e90584
generated_at: 2026-03-04T05:40:15.496Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: lib/models/factory.js

## Purpose
The ProviderFactory class is responsible for creating instances of different provider classes, which are used to interact with various AI models. It resolves the authentication and configuration details for each provider before instantiating the class. The factory also provides a way to override the configuration values.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| ProviderFactory | cjs_default | Creates instances of different provider classes |

## Internal Logic
The main execution flow involves resolving the authentication details, configuration, and environment variables for each provider. The `create` method takes in the provider ID, model name, and override configuration as inputs.

Key functions:

- `ProfileManager.resolveApiKey(providerId, overrideConfig)`: Resolves the authentication API key for a given provider.
- `ModelConfig.resolveProviderConfig(providerId)`: Resolves the base URL and other configuration details for a given provider.
- `ProviderClass instantiation`: Instantiates the class corresponding to the given provider ID.

The constructor initializes an object that maps provider IDs to their respective class constructors. The `create` method uses this mapping to create instances of the classes, merging in the override configuration values.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ProfileManager | Yes | Manages authentication details |
| ModelConfig | Yes | Resolves provider-specific configurations |
| OpenAIProvider | Yes | Implements OpenAI-compatible AI model functionality |
| AnthropicProvider | Yes | Provides implementation for Anthropic AI model |
| GoogleProvider | Yes | Offers Google Cloud-based AI model capabilities |
| OllamaProvider | Yes | Supports Ollama AI model interactions |

## Side Effects
- console_output: 
  The code includes a warning comment that prints to the console if no authentication details are found for certain providers. However, this is currently commented out.
- env_access: 
  The code accesses environment variables to override the base URL for some providers.

## Dependents
No known dependents.

## Cross-References
- [profile-mgr.js](../auth/profile-mgr.js.md)
- [config.js](./config.js.md)
- [anthropic.js](./providers/anthropic.js.md)
- [google.js](./providers/google.js.md)
- [ollama.js](./providers/ollama.js.md)
- [openai.js](./providers/openai.js.md)
