---
source_hash: 3765fbfffc6b5947
facts_hash: be18dace5a244dd2
generated_at: 2026-03-04T05:24:21.781Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: agents/Sutradhar.js

## Purpose
This file defines the `Sutradhar` class, a subclass of `CoreAgent`, which is responsible for managing the swarm and completing user missions safely and effectively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `create_task` | function | Creates a new task on the Kanban board and optionally assigns it to Shishya. |
| `update_task_status` | function | Updates the status of a task, signaling mission completion when necessary. |

## Internal Logic
The main execution flow involves creating a new instance of `Sutradhar`, which initializes its tools and connects to the bus. The constructor sets up the agent's prompt and defines its sub-agents. Key functions include:
- `setTools`: Configures the agent's available tools, including `create_task` and `update_task_status`.
- `constructor`: Initializes the agent with a name and role, setting up its tools and connecting to the bus.
- `boot`: Optionally boots the agent if it has a boot method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Implements the basic Agent pattern. |
| `../lib/SwarmProtocol` | Yes | Provides communication protocols for interacting with other agents. |

## Side Effects
- console_output: The agent logs information about creating tasks to the console using `console.log`.
- subprocess: The `create_task` tool runs in the background, creating a new task on the Kanban board without outputting raw JSON calls.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [SwarmProtocol.js](../lib/SwarmProtocol.js.md)
