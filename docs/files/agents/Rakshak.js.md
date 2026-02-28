---
source_hash: ed4c4da78d2a2d27
facts_hash: d13506397c105bba
generated_at: 2026-02-25T11:53:46.847Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Rakshak.js

## Purpose
The Rakshak.js file defines a custom agent class, Rakshak, which extends the CoreAgent class. It is responsible for handling security audit requests and enforcing OWASP Top 10 strictures to ensure secure coding practices. The agent's primary function is to analyze incoming messages and report potential vulnerabilities with alarming urgency.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Rakshak` | cjs_default | Exports the Rakshak class, allowing it to be imported and used by other parts of the system. |

## Internal Logic
The main execution flow of Rakshak.js involves the following key functions:
- The constructor initializes the agent with a name, role, and scope, loads skills from the SkillLoader, and sets tools for file operations.
- The `processMessage` method analyzes incoming messages and triggers security audits if necessary. It also updates the agent's heartbeat status and uses the CoreLoop functionality by default.
- The `boot` method is responsible for starting the agent's execution.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides a base class for custom agents. |
| `../lib/db` | Yes | Enables communication with the database for heartbeat updates. |
| `../lib/LLM` | Yes | Offers natural language processing capabilities for generating security reports. |
| `../lib/SkillLoader` | Yes | Loads skills required by the Rakshak agent, such as suraksha and drishti. |
| `path` | No | Provides utility functions for working with file paths. |

## Side Effects
- console_output: The agent logs messages to the console, including its name, heartbeat status, and security report generation.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
