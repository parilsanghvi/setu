---
source_hash: 3bc4bdeda4eeed92
facts_hash: 0ce3eef689e374ac
generated_at: 2026-03-04T05:28:01.558Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: bin/setup.js

## Purpose
This file sets up a configuration for a Dual-Model Environment, using the `setup` function to guide the user through selecting model providers and saving the settings to a `.env` file.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `configureModel` | function | `type, defaults = {}` | Configures a specific type of model. |
| `setup` | function | `` | Sets up the configuration for the Dual-Model Environment. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `setup` function is called, which initializes an object to store the environment data.
2. The `configureModel` function is used twice: once to configure an "expensive" model and again to configure a "cheap" model.
3. After configuring both models, the user is asked if they want to use the same configuration for the cheap model.
4. If the user chooses to use the same configuration, all settings from the expensive model are copied to the cheap model.
5. Otherwise, a new set of settings is configured for the cheap model.
6. The `setup` function then writes the environment data to a `.env` file using the `fs` module.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/profile-mgr` | Yes | Manages user authentication profiles. |
| `../lib/llm/OpenAICompatible` | Yes | Provides compatibility utilities for OpenAI models. |
| `../lib/models/providers/google` | Yes | Supplies Google provider-specific functionality. |

## Side Effects
- console_output: The file logs messages to the console, including a welcome message, configuration options, and success messages.
- filesystem_write: The file writes data to a `.env` file in the current working directory.
- network: The file may make HTTP requests to fetch models from OpenAI or Google providers.

## Dependents
No known dependents.

## Cross-References
- [profile-mgr.js](../lib/auth/profile-mgr.js.md)
- [OpenAICompatible.js](../lib/llm/OpenAICompatible.js.md)
- [google.js](../lib/models/providers/google.js.md)
