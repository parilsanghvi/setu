---
source_hash: 6671f0b50165ad70
facts_hash: ac68e6fe118a0d5e
generated_at: 2026-03-04T05:31:42.988Z
generator_version: 1.0.0
model: cheap
quality_score: 81
---
# File: frontend/app/src/hooks/useSocket.js

## Purpose
The useSocket hook establishes a connection to a Socket.IO server, retrieves and stores authentication credentials, and updates real-time data such as logs, agents, tasks, and chat messages.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `useSocket` | esm_named | Returns an object with the socket instance, connectivity status, and up-to-date log data. |

## Internal Logic
The main execution flow of this hook involves:

*   Initializing a Socket.IO connection using the getStoredCredentials function to retrieve stored authentication credentials or prompt the user for input.
*   Setting up event listeners for various Socket.IO events such as disconnect, connect_error, log, log_history, agents_update, tasks_update, chat_message, and chat_history.
*   Updating internal state with new data received from the Socket.IO server.

Key functions include:

*   `getStoredCredentials`: Retrieves stored authentication credentials or prompts the user to input them if not stored.
*   `initSocket`: Establishes a connection to the Socket.IO server using the retrieved or input credentials.
*   `socket.on(event)`: Sets up event listeners for various Socket.IO events.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `useSocket` | Yes | Handles its own dependencies directly. |
| `../utils/logUtils` | Yes | Provides the updateLogs function used to format and store log data. |
| `socket.io-client` | No | Imports the io module from socket.io-client, but does not use it locally within this hook. |

## Side Effects
-   console_output: The hook logs connection status updates, error messages, and new log entries to the console.
-   network: Establishing a Socket.IO connection involves sending authentication credentials and receiving real-time data from the server over a network connection.

## Dependents
No known dependents.

## Cross-References
- [logUtils.js](../utils/logUtils.js.md)
