---
source_hash: 0c07055959a6bf3a
facts_hash: 2e21b9e6dcfe3dc8
generated_at: 2026-03-04T05:23:50.412Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: agents/Shilpi.js

## Purpose
This file defines a class `Shilpi` that extends the `CoreAgent` class, which is used for managing frontend-related tasks and interactions. The `Shilpi` class provides specialized skills for frontend development and uses a natural language processing (NLP) model to evaluate UI specifications and generate critiques. It also handles user input and updates the system context.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Shilpi | cjs_default | Handles incoming requests and provides responses for frontend-related tasks and interactions |
| processMessage | function | 
| handleSpecProposal | function | 
| looksLikeUI | function | 
| initializeScope | function | 

## Internal Logic
The main execution flow of the `Shilpi` class involves:
- Initializing the agent with a name, role, and scope in its constructor.
- Defining specialized skills for frontend development using the `SkillLoader`.
- Handling incoming messages by calling the `processMessage` method.
- Evaluating UI specifications using the NLP model in the `handleSpecProposal` method.
- Providing critiques and updates to the system context.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| CoreAgent | Yes | Provides a base class for managing agent behavior |
| Context | No | 
| Contractor | No | 
| db | Yes | Manages database interactions |
| LLM | Yes | Provides natural language processing capabilities |
| SkillLoader | Yes | Loads and manages specialized skills for frontend development |
| fs | No | 

## Side Effects
- console_output: The `console.log` statements in the code output messages to the console.
- filesystem_read: The `fs.existsSync` and `context.read` methods read data from the file system and context storage.
- filesystem_write: The `fs.mkdirSync`, `fs.writeFileSync`, and `context.write` methods write data to the file system and context storage.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
