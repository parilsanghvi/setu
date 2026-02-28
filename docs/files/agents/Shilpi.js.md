---
source_hash: 0c07055959a6bf3a
facts_hash: 7d687671db1f6b96
generated_at: 2026-02-25T11:54:04.387Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: agents/Shilpi.js

## Purpose
This file defines the `Shilpi` class, a type of agent in a conversational AI system. The `Shilpi` class extends the `CoreAgent` class and is responsible for handling frontend-related tasks, such as critiquing UI designs and evaluating specifications. It interacts with other modules to perform its functions.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Shilpi` | cjs_default | Handles incoming requests and performs actions related to frontend design critique and specification evaluation. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `Shilpi` class constructor initializes the agent with a name, role, and scope.
2. The `processMessage` method handles incoming messages from users or other agents in the system.
3. If the message type is 'PROPOSE_SPEC', it calls the `handleSpecProposal` method to evaluate and respond to the specification proposal.
4. If the message type is 'ui_review' or if the content looks like UI-related code, it uses the LLM (Large Language Model) to generate a critique of the design.
5. For other interactions that don't fit into the above cases, it falls back to the `CoreAgent` loop and calls its `processMessage` method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides context information for the agent. |
| `../lib/Contractor` | Yes | Handles contractor-related tasks, such as recording vetoes and approvals. |
| `../lib/CoreAgent` | Yes | Provides a basic implementation of an agent that can handle incoming messages. |
| `../lib/db` | Yes | Manages database operations for the system. |
| `../lib/LLM` | Yes | Utilizes a large language model to generate critiques and responses. |
| `../lib/SkillLoader` | Yes | Loads specialized skills for the agent. |
| `fs` | No | Provides file system utilities, but is not used directly by this module. |
| `path` | No | Provides path manipulation utilities, but is not used directly by this module. |

## Side Effects
- console_output: The agent logs messages to the console during its execution.
- filesystem_read: The agent reads files from the file system to initialize scope and load skills.
- filesystem_write: The agent writes context information to a file in the file system when initializing scope.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
