---
source_hash: 7efc8f5d1cc2b1a0
facts_hash: eceab263717c6e3b
generated_at: 2026-03-04T05:24:36.512Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: agents/Tark.js

## Purpose
This file defines the Tark class, a type of agent in the system that handles budget and skill-related tasks, as well as performs logical critiques of code.

| Export | Type | Description |
|--------|------|-------------|
| `processMessage` | function | Handles incoming requests from other agents |
| `handleSpecProposal` | function | Handles specification proposals for tasks |
| `askLLM` | function | Asks the LLM to generate a response to a given prompt |

## Internal Logic
The Tark class extends the CoreAgent class and has several key methods. The constructor initializes the agent with its name, role, and scope, as well as loading skills and tools. The processMessage method handles incoming requests from other agents, including budget checks and code reviews. The handleSpecProposal method is a custom handler for specification proposals that uses the LLM to generate a response. The askLLM method is a helper function that asks the LLM to generate a response to a given prompt.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Provides budget checking functionality |
| `../lib/Context` | Yes | 
| `../lib/Contractor` | Yes | Manages contractor interactions with agents |
| `../lib/CoreAgent` | Yes | Serves as a base class for Tark and other agents |
| `../lib/db` | Yes | Provides database interaction functionality |
| `../lib/LLM` | Yes | 
| `../lib/SkillLoader` | Yes | Loads skills for the agent |

## Side Effects
- console_output: The processMessage method logs a message to the console indicating that a new message is being processed.

## Dependents
No known dependents.

## Cross-References
- [Budget.js](../lib/Budget.js.md)
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
