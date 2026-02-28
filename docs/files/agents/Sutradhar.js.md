---
source_hash: 045d0f9c75200786
facts_hash: 795aa4ffdec26b5b
generated_at: 2026-02-25T11:54:32.419Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: agents/Sutradhar.js

## Purpose
This file defines the `Sutradhar` class, which is a type of agent that orchestrates tasks in a swarm system. The `Sutradhar` class extends the `CoreAgent` class and uses protocols to communicate with other agents and manage tasks. It provides tools for assigning and updating task status.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Sutradhar | cjs_default | Exports the `Sutradhar` class, which can be instantiated and used in other parts of the system. |

## Internal Logic
The main execution flow of this file is as follows:

- The constructor initializes the agent with a name and role, setting up the base properties for the Sutradhar agent.
- The `setTools` method is called to define specific tools that can be used by the Sutradhar agent. These tools include `assign_task` and `update_task_status`, which handle task assignment and status updates respectively.
- The `boot` method is not explicitly defined in this file, but it is assumed to be a part of the CoreAgent class or another file that extends it.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ../lib/CoreAgent | Yes | Provides the base class for Sutradhar agents. |
| ../lib/SwarmProtocol | Yes | Enables protocol-based communication between agents and with other parts of the system. |

## Side Effects
- console_output: The `console.log` statements in the `assign_task` and `update_task_status` tools output messages to the console indicating task assignments and status updates.
- subprocess: None

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [SwarmProtocol.js](../lib/SwarmProtocol.js.md)
