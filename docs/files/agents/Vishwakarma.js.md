---
source_hash: eecbde0e33edb1ea
facts_hash: c9049f1119fc5c32
generated_at: 2026-02-25T11:55:41.136Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: agents/Vishwakarma.js

## Purpose
The Vishwakarma.js file defines a custom agent class for the system, extending the CoreAgent class from the infrastructure domain. The Vishwakarma agent handles incoming requests and messages, auditing infra files, evaluating spec proposals, and providing feedback to users through its persona-based responses.

| Export | Type | Description |
|--------|------|-------------|
| `Vishwakarma` | cjs_default | Exports the Vishwakarma class for use in other parts of the system. |

## Internal Logic
The main execution flow of the Vishwakarma agent involves handling incoming messages and requests. The constructor initializes the agent's properties, including its persona and tools. The processMessage method is called for each incoming message, which triggers various actions such as active heartbeat, spec negotiation, file watcher, or defaulting to core loop processing.

Key functions include:
- `isInfraFile`: determines if a file path belongs to the infrastructure domain.
- `handleSpecProposal`: evaluates an infrastructure spec proposal and provides feedback based on LLM-generated responses.
- `auditInfraFile`: audits the structure of a given infrastructure file using LLM-generated audit prompts.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the base class for custom agents. |
| `../lib/Context` | Yes | Supplies context information for agent operations. |
| `../lib/Contractor` | Yes | Manages task approvals and vetoes. |
| `../lib/db` | Yes | Allows the agent to interact with the database. |
| `../lib/LLM` | Yes | Generates LLM-based responses for various operations. |

## Side Effects
- console_output: The agent logs messages to the console during its execution, including system prompts, audit results, and feedback messages.
- filesystem_read: The agent reads file content from disk using fs.readFileSync when auditing infrastructure files.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
