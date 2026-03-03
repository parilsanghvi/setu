---
source_hash: ae71e344fd878d0b
facts_hash: 6ad87bf7f22efbdc
generated_at: 2026-03-03T07:12:05.524Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: frontend/app/src/hooks/useSocket.js

## Purpose
This file provides a custom React hook called `useSocket`, which establishes a connection to a Socket.IO server, handles incoming messages and updates, and exposes the socket instance, connection status, agents, tasks, and logs as a stateful object.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| useSocket | esm_named | Returns an object with the socket instance, connection status, agents, tasks, and logs. |

## Internal Logic
The `useSocket` hook uses React's `useState` to manage the state of the socket connection, messages, and updates. The main execution flow involves initializing a Socket.IO client outside the component, connecting to the server in `useEffect`, and listening for various event types such as `connect`, `disconnect`, `log`, `log_history`, `chat_history`, `agents_update`, and `tasks_update`. Key functions include:

- `formatLog(content)`: formats incoming log messages with a unique ID
- `onConnect()`, `onDisconnect()`: update the connection status state variable
- `onLog(msg)`, `onChatMessage(msg)`: format and add incoming logs to the state array
- `onLogHistory(hist)`, `onChatHistory(history)`: format and add log or chat history messages to the state array
- `onAgentsUpdate(data)`, `onTasksUpdate(data)` : update agents and tasks state arrays with new data

The hook also disconnects from the server when the component unmounts.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| io | Yes | Provides a low-level API for establishing Socket.IO connections. |
| updateLogs | Yes | 
| useState, useEffect, useRef | No | 

## Side Effects
- console_output: The `console.log` statements in the event handlers log messages to the console when the socket connection is established or disconnected.

## Dependents
No known dependents.

## Cross-References
- [logUtils.js](../utils/logUtils.js.md)
