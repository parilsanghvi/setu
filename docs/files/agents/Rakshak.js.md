---
source_hash: ed4c4da78d2a2d27
facts_hash: cd64b495164e1cc1
generated_at: 2026-03-04T05:23:35.194Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Rakshak.js

## Purpose
The Rakshak.js file defines a class that extends the CoreAgent, which is used to represent a security audit agent in the system. The Rakshak class is responsible for scanning incoming messages for potential security vulnerabilities and generating a security report if necessary.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Rakshak` | cjs_default | Exports the Rakshak class, allowing it to be instantiated and used in other parts of the system. |

## Internal Logic
The main execution flow of the Rakshak class involves the following key functions:
- The constructor initializes the agent's properties, including its name, role, and persona, as well as loading skills and defining tools.
- The `processMessage` function is called for each incoming message. It checks if the message requires a security audit and generates a report if necessary. If not, it falls back to using the CoreLoop function.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the base class for the Rakshak agent.
| `../lib/db` | Yes | Allows the agent to interact with the database.
| `../lib/LLM` | Yes | Enables the generation of security reports using a language model.
| `../lib/SkillLoader` | Yes | Loads skills for the Rakshak agent, including suraksha and drishti.
| `path` | No | Provides functionality for working with file paths.

## Side Effects
- console_output: The agent logs various messages to the console, including when it is scanning a packet or initiating security protocol.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
