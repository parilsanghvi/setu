---
source_hash: 01618c6d26e180fe
facts_hash: 3f5e60461e3f318f
generated_at: 2026-02-25T12:00:10.432Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: frontend/app/src/hooks/useSocket.js

## Purpose
This file defines the `useSocket` hook, which establishes a socket connection to a server and provides updates on logs, agents, tasks, and chat messages in real-time.

| Export | Type | Description |
|--------|------|-------------|
| useSocket | esm_named | Provides an object with a socket connection and state updates for log, agent, task, and chat data. |

## Internal Logic
The `useSocket` hook initializes a socket connection outside of the component and uses React's `useEffect` to establish the connection when the component mounts. The main execution flow involves setting up event listeners for incoming messages from the server.

Key functions:

* `onConnect`: Sets the `isConnected` state to true when the client connects to the server.
* `onDisconnect`: Sets the `isConnected` state to false when the client disconnects from the server.
* `onLog`: Updates the `logs` state with new log messages received from the server, using the `updateLogs` function from `logUtils`.
* `onLogHistory`: Updates the `logs` state with historical log data received from the server.
* `onAgentsUpdate`, `onTasksUpdate`, and `onChatMessage`: Update their respective state variables with data received from the server.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| io | Yes | Creates a socket.io client instance. |
| updateLogs | Yes | Provides a function to update log data. |
| react | No | Used for React hooks and state management. |
| socket.io-client | No | Provides a client-side implementation of the Socket.IO protocol. |

## Side Effects
- console_output: Logs messages to the console when the connection is established or disconnected.

## Dependents
No known dependents.

## Cross-References
- [logUtils.js](../utils/logUtils.js.md)
