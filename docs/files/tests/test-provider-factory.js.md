---
source_hash: baf5d17c2c624535
facts_hash: 2c345a7325dfea44
generated_at: 2026-03-04T06:06:09.671Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-provider-factory.js

## Purpose
This file contains a test suite for the `ProviderFactory` class in the `lib/models/factory.js` module, which creates instances of various provider classes based on the input parameters. The tests cover scenarios such as creating valid providers, handling unknown providers, environment variable overrides, configuration merging, and creating providers without authentication.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `ProviderFactory` | function | `` | Creates instances of provider classes based on input parameters. |
| `MockAnthropicProvider` | class | `` | A mock implementation of the Anthropic provider class. |
| `MockGoogleProvider` | class | `` | A mock implementation of the Google provider class. |
| `MockOllamaProvider` | class | `` | A mock implementation of the Ollama provider class. |
| `MockOpenAIProvider` | class | `` | A mock implementation of the OpenAI provider class. |
| `mocks` | arrow | `{../auth/profile-mgr`, './config', etc.} | An object containing mocked dependencies for testing purposes. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `runTests` function is called, which creates an instance of the `ProviderFactory` class and calls its `create` method with various input parameters.
2. The `ProviderFactory` class uses the mocked dependencies stored in the `mocks` object to resolve provider configurations and create instances of the corresponding provider classes.
3. Each test case exercises a specific scenario, such as creating a valid provider or handling an unknown provider.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | Yes | Provides assertion utilities for testing. |
| `module` | No | Provides the `require` function for loading modules and their dependencies. |

## Side Effects
- console_output: The test suite logs various messages to the console, including success and failure indicators.
- env_access: The test suite accesses environment variables to simulate configuration overrides.

## Dependents
No known dependents.

## Cross-References
- [factory.js](../lib/models/factory.js.md)
