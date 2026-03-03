---
source_hash: 045d0f9c75200786
facts_hash: 00b92708a24da1f6
generated_at: 2026-03-03T07:04:58.712Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: agents/Sutradhar.js

## Purpose
This file defines a JavaScript class `Sutradhar` that extends the `CoreAgent` class, which is responsible for managing a swarm of agents (Tark, Shilpi, Guru, Shishya) to complete user missions.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Sutradhar` | cjs_default | Exports the Sutradhar class, which can be used by other modules. |

## Internal Logic
The main execution flow of this file is as follows:
- The constructor initializes the Sutradhar agent with a name and role.
- It sets up two tool functions: `assign_task` and `update_task_status`.
  - `assign_task`: Assigns tasks to sub-agents, updates task status in the bus, and broadcasts the assignment to all agents.
  - `update_task_status`: Updates the status of a task (including 'MISSION' for completion) in the bus.
- The agent boots by calling its own boot method, which is inherited from the CoreAgent class.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the base class for Sutradhar agents. |
| `../lib/SwarmProtocol` | Yes | Supplies protocol-related functions used by Sutradhar. |

## Side Effects
- console_output: The agent uses the `console.log` function to output messages, such as task assignments and updates.
- subprocess: The file does not create any subprocesses; it only defines an agent class that will be executed in a separate process or thread.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [SwarmProtocol.js](../lib/SwarmProtocol.js.md)
