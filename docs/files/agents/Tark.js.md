---
source_hash: 7efc8f5d1cc2b1a0
facts_hash: b12e9fc86f2b2c7c
generated_at: 2026-03-03T07:05:12.967Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Tark.js

## Purpose
This file defines a JavaScript class named Tark, which extends the CoreAgent class. The Tark class represents a specific type of agent that handles budget check and negotiation for tasks in a system. The handleSpecProposal method is a custom function used to evaluate specifications for tasks using a large language model (LLM).

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Tark` | cjs_default | Handles budget check, negotiation, and code review for tasks. |

## Internal Logic
The Tark class has the following key functions:

- `constructor`: Initializes a new instance of the Tark class with a given name and role.
- `processMessage`: Handles incoming messages by checking if they require budget negotiation or code review.
- `handleSpecProposal`: Evaluates specifications for tasks using an LLM and handles veto responses.
- `askLLM`: Helper function to use LLM without a tool loop.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Budget` | Yes | Provides budget checking functionality |
| `../lib/Context` | Yes | 
| `../lib/Contractor` | Yes | 
| `../lib/CoreAgent` | Yes | 
| `../lib/db` | Yes | 
| `../lib/LLM` | Yes | 
| `../lib/SkillLoader` | Yes | 
| `fs` | No | 
| `path` | No | 

## Side Effects
- console_output: Console logs messages during certain operations, such as loading skills and processing incoming messages.

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
