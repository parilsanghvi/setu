---
source_hash: 1fda457da576aa58
facts_hash: 1fda457da576aa58
generated_at: 2026-03-03T07:55:54.018Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: agents

## Purpose
This folder contains various agent classes responsible for managing tasks, skills, and security in a system. The agents interact with each other, systems, and external resources to learn, improve, and complete user missions.

## Key Files
| File | Role |
| Guru.js | Generates skills to improve understanding of topics based on incoming messages and extracted patterns. |
| Koshpal.js | Ensures data safety and security in a database system by handling incoming messages and making decisions based on persona and skills. |
| Rakshak.js | Handles security-related tasks, providing a persona-based experience, and triggering security audits upon processing incoming messages. |
| Shilpi.js | Manages frontend lead tasks in a studio environment, critiquing UI aesthetics using an LLM, and managing skill sets for leads. |
| Shishya.js | Proposes plans and tasks for junior agents to execute, generating plans, writing files, and handling incoming messages. |
| Sutradhar.js | Manages a swarm of agents (Tark, Shilpi, Guru, Shishya) to complete user missions. |
| Tark.js | Handles budget check and negotiation for tasks in the system using a large language model (LLM). |
| TestAgent.js | Demonstrates a simple conversation between agents by responding with "PONG" when it receives a "PING" message. |
| TestDrona.js | Simulates task completion, waiting for skill generation, and verifying task updates in the system. |
| Vaidya.js | Boots up the system by checking various components, including environment, Docker, database, and node modules. |
| Vishwakarma.js | Handles incoming messages, performs tasks such as spec negotiation, file auditing, and responds to users using various modules like LLM, Contractor, and CoreAgent. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All agent classes follow the Singleton pattern to ensure only one instance of each class exists in memory.
Likely: The system uses a centralized logging mechanism for all agents to log their actions and decisions.
The system enforces strict security measures by requiring agents to authenticate and authorize before performing tasks.

## Cross-References
- [Guru.js](../../files/agents/Guru.js.md)
- [Koshpal.js](../../files/agents/Koshpal.js.md)
- [Rakshak.js](../../files/agents/Rakshak.js.md)
- [Shilpi.js](../../files/agents/Shilpi.js.md)
- [Shishya.js](../../files/agents/Shishya.js.md)
- [Sutradhar.js](../../files/agents/Sutradhar.js.md)
- [Tark.js](../../files/agents/Tark.js.md)
- [TestAgent.js](../../files/agents/TestAgent.js.md)
- [TestDrona.js](../../files/agents/TestDrona.js.md)
- [Vaidya.js](../../files/agents/Vaidya.js.md)
- [Vishwakarma.js](../../files/agents/Vishwakarma.js.md)

