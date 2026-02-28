---
source_hash: 7efc8f5d1cc2b1a0
facts_hash: 2d361972f3007ac4
generated_at: 2026-02-25T11:54:48.799Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Tark.js

## Purpose
The Tark.js file defines a class `Tark` that extends the `CoreAgent` class, which is responsible for handling incoming messages and ensuring tasks are completed efficiently with a focus on logic and security. The `Tark` class provides a custom workflow for evaluating specifications and making decisions based on these evaluations. It interacts with various modules, including budget management, contractor logging, and LLM (Large Language Model) generation.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Tark` | cjs_default | Exports the Tark class for use in other parts of the system. |

## Internal Logic
The main execution flow of the Tark class can be broken down into several key functions:
- The constructor initializes the agent's properties, including its name, role, and persona, as well as loading skills and defining tools.
- The `processMessage` function is called when an incoming message is received. It performs budget checks, delegates to the CoreAgent loop for normal chat/code review, and records costs (simulated).
- The `handleSpecProposal` function is a custom logic that uses LLM directly to evaluate specifications. If the result includes "VETO", it logs a veto; otherwise, it approves the specification.
- The `askLLM` function is a helper function used by `handleSpecProposal` to interact with the LLM.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Provides budget management functionality. |
| `../lib/Context` | Yes | 
| `../lib/Contractor` | Yes | 
| `../lib/CoreAgent` | Yes | 
| `../lib/db` | Yes | 
| `../lib/LLM` | Yes | 
| `../lib/SkillLoader` | Yes | 
| `fs` | No | 
| `path` | No | 

## Side Effects
- console_output: The `Tark` class logs messages to the console using `console.log` and `this.speak`, which are called during various execution paths.

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
