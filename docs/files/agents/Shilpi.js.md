---
source_hash: 0c07055959a6bf3a
facts_hash: 1fcc242548485689
generated_at: 2026-03-03T07:04:24.316Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: agents/Shilpi.js

## Purpose
This file defines a JavaScript class `Shilpi` that extends the `CoreAgent` class, which is used to manage frontend lead tasks in a studio environment. The `Shilpi` class handles incoming messages, critiques UI aesthetics using an LLM (Large Language Model), and manages skill sets for the lead. It also interacts with the database and other components of the system.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Shilpi` | cjs_default | Exports a JavaScript class that extends CoreAgent, handling frontend tasks. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `Shilpi` constructor initializes the agent with its name, role, and scope.
2. The `processMessage` method handles incoming messages from the studio environment, critiquing UI aesthetics using LLM if necessary, and managing task proposals.
3. The `handleSpecProposal` method evaluates UI specifications for tasks and makes decisions based on the evaluation results.
4. The `looksLikeUI` function checks whether a message contains UI-related keywords.
5. The `initializeScope` method initializes or updates the scope directory in the system.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides context information for the lead. |
| `../lib/Contractor` | Yes | Manages task approvals and vetoes. |
| `../lib/CoreAgent` | Yes | Serves as a base class for frontend leads. |
| `../lib/db` | Yes | Interacts with the database to store and retrieve information. |
| `../lib/LLM` | Yes | Generates critiques for UI aesthetics using LLM. |
| `../lib/SkillLoader` | Yes | Loads skill sets for the lead. |

## Side Effects
- console_output: The agent logs messages and output to the console.
- filesystem_read: The agent reads file contents and initializes scope directories as necessary.
- filesystem_write: The agent writes content to files using the "write_file" tool.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
