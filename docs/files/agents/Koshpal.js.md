---
source_hash: d5d790205abb3315
facts_hash: 38e02a2f66334cf0
generated_at: 2026-03-04T05:23:22.575Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: agents/Koshpal.js

## Purpose
The Koshpal class is a CoreAgent that handles incoming requests and provides a persona-driven assessment of database proposals, while also managing the database scope and ensuring data integrity.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Koshpal` | cjs_default | Exports the Koshpal class |

## Internal Logic
The main execution flow is as follows:
- The constructor initializes the agent with a name, role, and database path.
- The processMessage function handles incoming requests, using persona-driven assessments to evaluate database proposals and ensuring data integrity.
- The handleSpecProposal function evaluates schema specs for tasks and returns a veto or approval response.
- The looksLikeQuery function checks if the content includes query keywords.
- The takeSnapshot function creates a snapshot of the database backup.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides context management utilities |
| `../lib/Contractor` | Yes | Handles contractor-related tasks such as vetoing and approving schema specs |
| `../lib/CoreAgent` | Yes | Provides the base class for Koshpal to inherit from |
| `../lib/db` | Yes | Manages database operations and heartbeat notifications |
| `../lib/LLM` | Yes | Generates persona-driven assessments using LLM |
| `../lib/SkillLoader` | Yes | Loads skills for the agent |

## Side Effects
- console_output: 
  - The constructor logs a message when equipping skills.
  - The processMessage function logs a heartbeat notification and assesses risk with LLM.
  - The takeSnapshot function logs a snapshot creation message.
- database: 
  - The initializeScope function checks if the scope exists, writes context data, and creates the scope if it doesn't exist.
- filesystem_read: 
  - The initializeScope function reads the scope file using fs.existsSync and fs.readFileSync.
- filesystem_write: 
  - The initializeScope function writes to the scope file using fs.writeFileSync.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
