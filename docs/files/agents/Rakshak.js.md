---
source_hash: ed4c4da78d2a2d27
facts_hash: 71918d750cdb2a5f
generated_at: 2026-03-03T07:04:08.284Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Rakshak.js

## Purpose
The Rakshak.js file defines a custom agent class that extends the CoreAgent, responsible for handling security-related tasks and providing a persona-based experience. The constructor initializes the agent with its name, role, and scope, and loads skills and tools. It then sets up an active heartbeat system and processes incoming messages to trigger security audits.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Rakshak | cjs_default | Exports the Rakshak class for use in other parts of the system |
| load | function | Loads skills for the Rakshak agent from a SkillLoader instance |
| speak | function | Outputs a message to a recipient using the Rakshak's persona and tone |

## Internal Logic
The main execution flow begins with the constructor, which initializes the agent's properties and sets up its tools. The processMessage method is called when an incoming message is received; it checks if the message requires security audit and generates a report if so. If not, it falls back to using the CoreLoop method provided by the parent class.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| path | Yes | Provides access to file system paths for setting up scope |
| SkillLoader | No | Loads skills and other assets for the Rakshak agent |
| LLM | No | Generates security audit reports using a Language Model Instance |
| db | No | Manages the database heartbeat system for the Rakshak agent |

## Side Effects
- console_output: The agent logs messages to the console, including when it initiates security audits and when it is equipping with skills.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
