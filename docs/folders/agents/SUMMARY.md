---
source_hash: 1fda457da576aa58
facts_hash: 1fda457da576aa58
generated_at: 2026-02-25T12:35:05.970Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: agents

## Purpose
This `agents` folder contains a collection of custom agent classes designed to perform various tasks in the system, including learning and generating knowledge, managing database interactions, enforcing security rules, handling frontend-related tasks, and orchestrating tasks in swarm systems.

## Key Files
| File | Role |
|------|------|
| Guru.js | Utilizes an LLM to learn and generate knowledge-based skills. |
| Koshpal.js | Manages database interactions and enforces risk assessment. |
| Rakshak.js | Enforces OWASP Top 10 strictures for secure coding practices. |
| Shilpi.js | Critiques UI designs and evaluates specifications. |
| Shishya.js | Generates plans for tasks using a Language Model (LLM). |
| Sutradhar.js | Orchestrates tasks in a swarm system using protocols. |
| Tark.js | Evaluates specifications and makes decisions based on evaluations. |
| TestAgent.js | Processes incoming messages for testing purposes. |
| TestDrona.js | Tests the functionality of a Drona agent. |
| Vaidya.js | Checks the health of the system by verifying environment and dependencies. |
| Vishwakarma.js | Handles incoming requests, audits infra files, and provides feedback to users. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The `CoreAgent` class is used as a base for all custom agent classes.
Likely: All agents follow the principle of least privilege, accessing only necessary resources and information.
Rule: Agents are expected to log their actions and decisions in a centralized logging system for auditing purposes.

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

