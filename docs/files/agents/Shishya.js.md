---
source_hash: 4858422335a5d70d
facts_hash: b99909a5372d71cc
generated_at: 2026-03-03T07:04:44.906Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: agents/Shishya.js

## Purpose
This file defines the `Shishya` class, a type of agent in a system that proposes plans and tasks for junior agents to execute. The `Shishya` class extends the `CoreAgent` class and provides functionality for generating plans, writing files, and handling incoming messages.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Shishya` | cjs_default | 
| `generatePlan` | function | Generates a plan based on the given objective. |
| `writePlan` | function | Writes content to a file in the specified scope. |
| `executeTask` | function | Executes a task and generates a plan for it. |
| `processMessage` | function | Handles incoming messages and updates the agent's status accordingly. |
| `onApproval` | function | Called when a plan is approved, implementation provided by specific intern roles. |

## Internal Logic
The main execution flow of this file involves creating an instance of the `Shishya` class, which extends the `CoreAgent` class. The constructor initializes the agent's properties and sets up its tools.

The key functions in this file are:

- `generatePlan(objective)`: This function generates a plan based on the given objective using the LLM (Large Language Model). It returns the generated plan as a string.
- `writePlan(content)`: This function writes content to a file in the specified scope. If the scope does not exist, it creates it and writes the content to the newly created directory.
- `executeTask(taskId, objective)`: This function executes a task and generates a plan for it. It updates the agent's status to 'PLANNING', generates the plan using `generatePlan`, writes the plan to a file using `writePlan`, and sends a message to the lead role with the proposal.
- `processMessage(msg)`: This function handles incoming messages and updates the agent's status accordingly. If the message is an approval, it moves the agent to the 'EXECUTING' state; if the message is a rejection, it moves the agent back to the 'PLANNING' state and calls the `revisePlan` method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides a basic structure for agents. |
| `../lib/LLM` | Yes | Supplies functionality for generating plans based on objectives. |
| `fs` | No | Allows the agent to read and write files to the file system. |
| `path` | No | Enables the agent to work with file paths. |

## Side Effects
- console_output: The agent logs messages to the console at various points in its execution flow, including when a plan is generated or written.
- filesystem_read: The agent reads files from the file system using `fs.readFileSync` or `fs.readFile`. For example, in `writePlan`, it reads the content of the file being written.
- filesystem_write: The agent writes files to the file system using `fs.writeFileSync` or `fs.writeFile`. For example, in `writePlan`, it writes the generated plan to a file.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [LLM.js](../lib/LLM.js.md)
