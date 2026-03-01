---
source_hash: bbbbc1489efb2779
facts_hash: a0f29db402c3ec8e
generated_at: 2026-02-25T12:02:33.773Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/Config.js

## Purpose
This file defines the `Config` class, which loads and validates configuration settings from environment variables, storing them as properties of an instance. The configuration is used to set up different parts of the system, including machine learning models and authentication with Google. The class also provides a way to access these configurations using the `get` method.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Config` | cjs_default | Creates a new instance of the configuration settings. |

## Internal Logic
The main execution flow is as follows:
- The `load` function checks if a `.env` file exists in the current directory and loads its contents into the instance's properties using `dotenv`.
- If no `.env` file exists, it logs a warning message to the console.
- The `validate` function checks if certain environment variables are present and sets default values for them if they're not.
- It also performs some additional validation checks on specific configuration settings, such as the presence of required API keys or client IDs.
- Finally, it calculates two threshold values based on the provider and stores them in instance properties.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `dotenv` | No | Provides a convenient way to load environment variables from files. |
| `fs` | No | Allows the class to check if a file exists in the current directory. |
| `path` | No | Helps the class construct paths to the `.env` file and other directories. |

## Side Effects
- console_output: The class logs warning messages to the console when certain conditions are not met, such as missing environment variables or invalid configuration settings.
- env_access: The class reads and parses environment variables from files and the process environment, using these values to set up the instance's properties.
- filesystem_read: The class checks if a `.env` file exists in the current directory before attempting to load its contents.

## Dependents
- [Camera.js](./Camera.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
- [Docker.js](./Docker.js.md)
- [LLM.js](./LLM.js.md)

## Cross-References
- [Camera.js](./Camera.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
- [Docker.js](./Docker.js.md)
- [LLM.js](./LLM.js.md)
