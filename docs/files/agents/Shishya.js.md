---
source_hash: 4858422335a5d70d
facts_hash: 87b9c0744f3ac250
generated_at: 2026-02-25T11:54:18.766Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: agents/Shishya.js

## Purpose
This file defines the `Shishya` class, a type of agent in a system that generates plans for tasks. The `Shishya` class extends the `CoreAgent` class and provides methods for generating plans, processing messages, and handling approvals. It uses a Language Model (LLM) to generate plan content.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Shishya | cjs_default | Exports the `Shishya` class as the default export. |

## Internal Logic
The main execution flow of the `Shishya` class is as follows:
- The `executeTask` method is called when a task is assigned to the agent. It proposes a plan, sends it to the lead role for approval, and then waits for approval.
- If the plan is approved, the `onApproval` method is called with the approval message.
- If the plan is rejected, the `revisePlan` method is called with the rejection critique.
- The `generatePlan` method uses an LLM to generate plan content based on a given objective.
- The `writePlan` method writes the generated plan content to a file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| CoreAgent | Yes | Provides the foundation for agent behavior. |
| LLM | Yes | Used to generate plan content. |
| fs | No | Used to read and write files. |
| path | No | Used to construct file paths. |

## Side Effects
- console_output: The `console.log` statements in the code output messages to the console.
- filesystem_read: The `fs.existsSync` method checks if a file exists, and the `fs.readFileSync` method reads the contents of a file.
- filesystem_write: The `fs.writeFileSync` method writes content to a file.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [LLM.js](../lib/LLM.js.md)
