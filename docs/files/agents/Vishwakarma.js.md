---
source_hash: eecbde0e33edb1ea
facts_hash: 4992e509fbc417d3
generated_at: 2026-03-04T05:25:35.624Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: agents/Vishwakarma.js

## Purpose
The Vishwakarma.js file defines a class `Vishwakarma` that extends the `CoreAgent` class, which is responsible for handling incoming requests and providing expert advice on infrastructure configuration. The class uses a Natural Language Processing (NLP) model to evaluate proposed specifications and audit infrastructure files for security vulnerabilities. It also interacts with a database to record approvals and vetoes.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Vishwakarma` | cjs_default | Exposes the Vishwakarma class, which handles incoming requests and provides expert advice on infrastructure configuration. |
| `setTools` | function | Sets tools for the agent to use, including a tool for reading file content. |

## Internal Logic
The main execution flow of the Vishwakarma.js file is as follows:

1. The constructor initializes the agent with a name, role, and scope.
2. The `processMessage` method handles incoming requests, checking if they are related to infrastructure configuration or file changes.
3. If the request is related to spec negotiation (infrastructure domain), it calls the `handleSpecProposal` method to evaluate the proposal.
4. If the request is related to file changes, it checks if the file is an infrastructure file and calls the `auditInfraFile` method to audit its structure.
5. The `handleSpecProposal` method uses a Natural Language Processing (NLP) model to evaluate the proposed specification and provides feedback in the form of an approval or veto message.
6. The `auditInfraFile` method uses an NLP model to identify potential security vulnerabilities in the infrastructure file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides context for the agent to operate within. |
| `../lib/Contractor` | Yes | Enables the agent to record approvals and vetoes in a database. |
| `../lib/CoreAgent` | Yes | Provides the foundation for the Vishwakarma agent to extend upon. |
| `../lib/db` | Yes | Facilitates communication with a database for storing agent activity. |
| `../lib/LLM` | Yes | Employs a Natural Language Processing model for evaluating proposals and auditing files. |

## Side Effects
- console_output: The agent logs messages to the console, including debugging information and user feedback.
- filesystem_read: The agent reads file content from disk using the `fs.readFileSync` method.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
