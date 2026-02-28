---
source_hash: e8f4a793e27ca6df
facts_hash: 7f0cad3f0e1914b0
generated_at: 2026-02-25T12:01:52.846Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/Agent.js

## Purpose
The Agent.js file provides a persistent worker class in the swarm, responsible for booting up, listening to messages, and processing system events. The Agent class handles tasks such as registering with the event bus, sending and receiving messages, and updating its status. It also manages heartbeat intervals and shutdown signals.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Agent` | cjs_default | Exports the Agent class for use in other parts of the system |

## Internal Logic
The main execution flow of the Agent class is as follows:

- The constructor initializes the agent with its name, role, scope, and bus.
- The boot method sets up the agent's initial state by registering with the event bus, starting a heartbeat loop, and listening for messages.
- The listen method sets up an IPC handler to receive messages from the Orchestrator and checks for new messages every 60 seconds.
- The checkForMessages method processes incoming messages, handling system events and updating the agent's status accordingly.
- The processMessage method handles individual system events by executing custom logic.
- The speak method sends a message to a recipient via the event bus.
- The shutdown method cleanly shuts down the agent by clearing heartbeat intervals and exiting the process.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality for the Agent class |
| `events` | No | Provides event handling capabilities for Node.js processes |
| `path` | No | Provides path manipulation utilities |

## Side Effects
- console_output: The agent logs messages to the console using its logger, including startup and shutdown messages, as well as errors.
- process_control: The agent controls the process lifecycle by setting up and clearing heartbeat intervals, listening for signals, and exiting cleanly when shut down.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [Logger.js](./Logger.js.md)
- [CoreAgent.js](./CoreAgent.js.md)
