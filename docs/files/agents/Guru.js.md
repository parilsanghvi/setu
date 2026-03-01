---
source_hash: 6ac1f950b9225246
facts_hash: 2cfc468dca4f4b87
generated_at: 2026-02-25T11:53:16.422Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: agents/Guru.js

## Purpose
The `Guru` class is a core agent in the system that utilizes a large language model (LLM) to learn and generate knowledge-based skills, which are then saved as Markdown files. It handles tasks such as learning new languages or frameworks from documentation, tracking dependency drift, and analyzing crashes to prevent future errors.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Guru` | cjs_default | Exposes the Guru agent class for use by other parts of the system. |

## Internal Logic
The main execution flow of the `Guru` class involves:

- The constructor, which initializes the agent's name, role, skills, and tools.
- The `processMessage` method, which handles incoming messages from the system and dispatches to specific methods based on the message type.
  - `trackDrift`: Tracks dependency drift by analyzing package version changes and generates a migration skill to assist with updates.
  - `learnLanguage`: Learns new languages or frameworks from documentation and generates syntax skills.
  - `analyzeCrash`: Analyzes crashes to identify lethal patterns and generates warning skills to prevent future errors.
- The `extractPattern`, `parseResponse`, and `saveSkill` methods, which are used internally by the `processMessage` method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides a base class for core agents. |
| `../lib/db` | Yes | Allows the agent to communicate with the database. |
| `../lib/LLM` | Yes | Enables the use of a large language model for knowledge generation. |
| `../lib/SkillLoader` | Yes | Loads and manages skills for the agent. |
| `../lib/utils/JsonParser` | Yes | Parses JSON responses from the LLM. |
| `fs` | No | Provides file system access. |

## Side Effects
- console_output: The agent logs messages to the console, including success messages, warnings, and errors.
- filesystem_read: The agent reads files from the file system, such as loading skills and generating patches.
- filesystem_write: The agent writes files to the file system, such as saving generated skills and patches.
- network: The agent does not have explicit network interactions, but it relies on the database and LLM for data exchange.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
- [JsonParser.js](../lib/utils/JsonParser.js.md)
