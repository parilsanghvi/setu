---
source_hash: eecbde0e33edb1ea
facts_hash: 8d1e3193db788724
generated_at: 2026-03-03T07:06:09.448Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: agents/Vishwakarma.js

## Purpose
The Vishwakarma.js file defines a class that extends the CoreAgent, representing Vishwakarma, the Divine Architect in the system. The class handles incoming messages and performs tasks such as spec negotiation, file auditing, and speaks responses to users. It utilizes various modules like LLM, Contractor, and CoreAgent for its functionality.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Vishwakarma` | cjs_default | Handles incoming requests and processes messages for the Vishwakarma persona. |

## Internal Logic
The main execution flow of Vishwakarma involves:
- The processMessage method, which handles incoming messages by checking the message type and performing specific actions.
  - It checks if the message is a spec proposal or an infra file change, and performs the corresponding action (handleSpecProposal or auditInfraFile).
  - If it's a default CoreLoop call, it proceeds with super.processMessage(msg).
- The handleSpecProposal method generates an evaluation response for the proposed infrastructure spec using LLM.
  - It checks if the evaluation includes "VETO" and records the reason in the Contractor.
  - Otherwise, it approves the task and speaks a response to the user.
- The auditInfraFile method audits the structure of the given infra file by generating an audit response with LLM.
  - If issues are found, it speaks a warning message to the user; otherwise, it logs that the file is structurally sound.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides contextual information for the agent. |
| `../lib/Contractor` | Yes | Manages task approvals and vetoes. |
| `../lib/CoreAgent` | Yes | Serves as a base class for Vishwakarma's functionality. |
| `../lib/db` | Yes | Facilitates heartbeat notifications to the bus. |
| `../lib/LLM` | Yes | Generates responses using large language models. |
| `fs` | No | Utilizes file system operations for reading files. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The agent logs messages to the console during its execution, including heartbeat notifications and responses.
- filesystem_read: The agent reads file contents using fs.readFileSync when auditing infra files, which may impact system performance if dealing with large files.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
