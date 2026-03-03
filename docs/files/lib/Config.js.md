---
source_hash: abf64779c9c93a3e
facts_hash: 89a774cf11b1b40b
generated_at: 2026-03-03T07:14:58.100Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/Config.js

## Purpose
This file contains the Config class, which loads and validates configuration settings from environment variables and a .env file. The Config class provides a way to access these settings in a centralized manner, allowing for easy switching between different providers and configurations. It also performs validation checks on the loaded settings to ensure consistency.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `get` | function | Returns the value of a specified environment variable key |
| `new` | cjs_default | Creates a new instance of the Config class |

## Internal Logic
The main execution flow begins with the constructor, which initializes the object's properties and loads the configuration settings. The load method checks if a .env file exists in the current working directory and configures dotenv accordingly. If no .env file is found, it logs a warning message.

Next, the validate method is called to parse environment variables and populate the Config instance with the corresponding values. This includes provider selection, API key setup, and other configuration settings. The method performs validation checks on these settings to ensure consistency and logs warnings if any issues are detected.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `dotenv` | No | Provides a simple way to load environment variables from a file |
| `fs` | No | Offers file system-related functions, including existence checks |
| `path` | No | Helps construct file paths and manipulate them in various ways |

## Side Effects
- console_output: The Config class logs warning messages to the console using console.warn() when certain conditions are met during configuration loading or validation.
- env_access: The Config class accesses environment variables using process.env to retrieve values for configuration settings, such as API keys and provider selection.
- filesystem_read: The Config class checks if a .env file exists in the current working directory using fs.existsSync(), indicating that it may need to read from the file system.

## Dependents
- [AgentContextManager.js](./AgentContextManager.js.md)
- [Camera.js](./Camera.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
- [Docker.js](./Docker.js.md)
- [LLM.js](./LLM.js.md)

## Cross-References
- [AgentContextManager.js](./AgentContextManager.js.md)
- [Camera.js](./Camera.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
- [Docker.js](./Docker.js.md)
- [LLM.js](./LLM.js.md)
