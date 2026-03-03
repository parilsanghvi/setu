---
source_hash: baf5d17c2c624535
facts_hash: 548456052886ae0e
generated_at: 2026-03-03T07:45:52.609Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-provider-factory.js

## Purpose
This file tests the functionality of the `ProviderFactory` class from the `lib/models/factory.js` module, ensuring it creates valid providers with correct configurations and handles unknown providers, environment variable overrides, and configuration merging.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockAnthropicProvider` | class | `` | 
| `MockGoogleProvider` | class | `` | 
| `MockOllamaProvider` | class | `` | 
| `MockOpenAIProvider` | class | `` | 
| `mocks` | arrow | `{
    '../auth/profile-mgr': {
        resolveApiKey: (providerId, options` | 
| `runTests` | function | `` |

## Internal Logic
The file executes a series of tests using the `runTests` function. Key functions include:

- `ProviderFactory.create`: Creates a new provider instance with the given name and configuration.
- `Module.prototype.require`: A mock implementation that returns the specified mocks or falls back to the original require function.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `../lib/models/factory` | Yes | Provides the ProviderFactory class |
| `assert` | No | 
| `module` | No | 

## Side Effects
- console_output: The file logs test progress and results to the console using `console.log` and `console.error`.
- env_access: The file accesses environment variables, specifically setting and deleting the `OPENAI_BASE_URL` variable.

## Dependents
No known dependents.

## Cross-References
- [factory.js](../lib/models/factory.js.md)
