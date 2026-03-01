---
source_hash: 102d51e030d5fbc3
facts_hash: 4769e5b8b65aaef1
generated_at: 2026-02-25T12:31:42.808Z
generator_version: 1.0.0
model: cheap
quality_score: 78
---
# File: tests/verify-agent-broadcast-optimization.js

## Purpose
This file tests the broadcast optimization feature of a SETU agent, verifying that updates on heartbeat and status changes are correctly propagated to clients.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `checkServerReady` | function | `` | Checks if the server is ready for connections by sending a request. |
| `cleanup` | function | `` | Cleans up resources after the test completes, including killing the child process and removing temporary files. |
| `if` | method | `agents.length > 0` | Checks if an agent exists in the list of received updates. |
| `interval` | arrow | `setInterval((` | Creates an interval to periodically send a request to check for server readiness. |
| `socket.on('connect')` | function | `` | Handles successful connections to the socket, injecting a test agent and listening for updates. |
| `socket.on('connect_error')` | function | `` | Handles connection errors with the socket. |
| `socket.on('agents_update')` | function | `` | Listens for updates on agents, updating local variables and logging received data. |
| `startTest` | function | `` | Starts the test by waiting for the server to be ready, connecting a socket, and injecting a test agent. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `startTest` function is called to begin the test.
2. It waits for the server to be ready using the `checkServerReady` function.
3. Once the server is ready, it connects to a socket and injects a test agent into the database.
4. The script then waits for updates on agents and checks if the test agent has been successfully injected.
5. After verifying that the test agent exists, it sends two types of updates (heartbeat only and status update) to see how they are handled by the broadcast optimization feature.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides spawn functionality for running a child process. |
| `fs` | No | Provides file system functions, including mkdtemp and rmSync. |
| `http` | No | Provides HTTP request functionality for checking server readiness. |
| `os` | No | Provides operating system-specific functions, including os.tmpdir(). |
| `path` | No | Provides path manipulation functions, including path.join. |
| `socket.io-client` | No | Provides a client-side implementation of the Socket.IO library. |

## Side Effects
- console_output: The script logs messages to the console for various events and results.
- database: The script interacts with the SQLite database, inserting data and reading updates on agents.
- env_access: The script accesses environment variables, including PORT and HOME, to set up the test environment.
- filesystem_write: The script writes temporary files and directories using fs.mkdtempSync() and fs.rmSync().
- network: The script establishes a connection to a server using http.get() and socket.io-client.
- process_control: The script uses process.on() events to clean up resources when the process exits or receives a SIGINT signal.
- subprocess: The script runs a child process using spawn(), which is killed by cleanup().

## Dependents
No known dependents.

## Cross-References
No cross-references.
