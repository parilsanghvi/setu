---
source_hash: 3bc4bdeda4eeed92
facts_hash: a93d15b611c9351a
generated_at: 2026-03-03T07:08:37.289Z
generator_version: 1.0.0
model: cheap
quality_score: 93
---
# File: bin/setup.js

## Purpose
This file, `setup.js`, is responsible for configuring the Dual-Model Environment by guiding users through a setup wizard that sets up expensive and cheap models, handles Docker setup, and writes configuration to a `.env` file.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `configureModel` | function | `type, defaults = {}` | Configures a specific model type. |
| `setup` | function | `` | Runs the setup wizard to configure the environment. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `setup()` function initializes the setup process by logging a welcome message and explaining its purpose.
2. It calls the `configureModel()` function twice: once for an expensive model and once for a cheap model, depending on user input.
3. For each model configuration, it asks the user to select or input various settings (e.g., provider, API key, base URL).
4. Based on user input, it sets up the environment with the selected settings.
5. If Docker is detected in the system's PATH, it allows users to specify its executable path and includes this setting in the configuration.
6. Finally, it writes all the configuration settings to a `.env` file using `fs.writeFileSync()`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/profile-mgr` | Yes | Manages user profiles for authentication purposes. |
| `../lib/llm/OpenAICompatible` | Yes | Provides compatibility functionality with OpenAI models. |
| `../lib/models/providers/google` | Yes | Handles Google model provider settings. |

## Side Effects
- console_output: The script logs various messages to the console throughout its execution, including welcome messages, progress updates, and success notifications.
- filesystem_write: The script writes configuration settings to a `.env` file in the current working directory.
- subprocess: It runs external commands using `execSync()` (e.g., launching Google login flow) as needed.

## Dependents
No known dependents.

## Cross-References
- [profile-mgr.js](../lib/auth/profile-mgr.js.md)
- [OpenAICompatible.js](../lib/llm/OpenAICompatible.js.md)
- [google.js](../lib/models/providers/google.js.md)
