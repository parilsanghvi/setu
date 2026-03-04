---
source_hash: 4858422335a5d70d
facts_hash: d67a5e532e6f255a
generated_at: 2026-03-04T05:24:06.486Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: agents/Shishya.js

## Purpose
This file implements the `Shishya` class, a type of agent in a system that generates plans for tasks. The `Shishya` class extends the `CoreAgent` and provides functionality for proposing, revising, and executing plans based on objectives.

| Export | Type | Description |
|--------|------|-------------|
| `processMessage` | function | Handles incoming messages from other agents or the system |
| `generatePlan` | function | Generates a plan for an objective using a Large Language Model (LLM) |
| `writePlan` | function | Writes content to a file in a specific scope |
| `boot` | function | Initializes and starts the agent |

## Internal Logic
The main execution flow of the `Shishya` class is as follows:
- The `executeTask` method is called when a task is assigned, which triggers a proposal phase where a plan is generated using the `generatePlan` method.
- The plan is then written to a file using the `writePlan` method and sent to the lead role for review.
- If approved, the agent moves to the execution phase; if rejected, it revises the plan based on feedback from the lead.

Key functions include:
- `executeTask`: Initiates the proposal and approval process for a task.
- `generatePlan`: Uses an LLM to generate a step-by-step plan for an objective.
- `writePlan`: Writes content to a file in a specific scope.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system utilities for reading and writing files |
| `path` | Yes | Provides utility functions for working with file paths |
| `../lib/CoreAgent` | No | Provides a base class for agents in the system |
| `../lib/LLM` | No | Provides a Large Language Model (LLM) for generating plans |

## Side Effects
- console_output: The agent logs messages to the console, including successful plan writes and revisions.
- filesystem_read: The agent reads files from the file system when writing a plan.
- filesystem_write: The agent writes content to files in the file system using `fs.writeFileSync`.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [LLM.js](../lib/LLM.js.md)
