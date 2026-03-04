---
source_hash: 102d51e030d5fbc3
facts_hash: 618e07926fb843bb
generated_at: 2026-03-04T06:10:25.083Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/verify-agent-broadcast-optimization.js

## Purpose
This file tests the broadcast optimization of a system by simulating an agent update and verifying that updates are received correctly on both heartbeat change and status change.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `checkServerReady` | function | `` | Checks if the server is ready to accept connections. |
| `cleanup` | function | `` | Cleans up resources used during testing, including closing sockets and killing child processes. |
| `if` | method | `agents.length > 0` | Evaluates a condition to determine whether an update has been received from the server. |
| `interval` | arrow | `setInterval((` | Creates an interval function to wait for server readiness. |
| `lastAgents` | arrow | `[];` | Stores the last received updates from the server. |
| `socket.on('connect', (` | `function() { ... }` | Listens for a connection event on the socket and injects a test agent into the database. |
| `req` | arrow | `http.get(SERVER_URL, (res` | Sends an HTTP request to the server to check its availability. |
| `retries` | arrow | `0; while (!lastAgents.find(a` | Waits for a specified amount of time before retrying if an update is not received from the server. |
| `startTest` | function | `` | Starts the testing process by connecting to the database and socket, injecting a test agent, and simulating updates to verify the broadcast optimization. |
| `ta` | arrow | `agents.find(a => a.name === 'TestAgent')` | Finds the TestAgent in the list of received updates from the server. |

## Internal Logic
The main execution flow of this file involves:
1. Setting up the test environment, including spawning an index.js process with modified HOME and logging settings.
2. Waiting for the server to become ready by checking its availability every 500 milliseconds.
3. Connecting to the database and socket, injecting a test agent into the database.
4. Simulating updates to verify the broadcast optimization, including updating the heartbeat and status of the test agent.
5. Verifying that updates are received correctly on both heartbeat change and status change.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides process spawning functionality for running index.js. |
| `fs` | No | Not used in this file, but required by child_process. |
| `http` | No | Used to send an HTTP request to the server to check its availability. |
| `os` | No | Required by fs and child_process. |
| `path` | No | Required by fs and os. |
| `socket.io-client` | No | Used to connect to the socket and simulate updates. |
| `better-sqlite3` | No | Not used in this file, but required by socket.io-client for database operations. |

## Side Effects

- console_output: The script logs various messages to the console during testing.
- database: The script interacts with the SQLite database to inject a test agent and update its heartbeat and status.
- env_access: The script modifies the HOME environment variable to specify the temporary directory used during testing.
- filesystem_write: The script writes to the file system to create the temporary directory and database file.
- network: The script sends an HTTP request to the server to check its availability and simulates updates over the socket.
- process_control: The script spawns a new process using child_process to run index.js and kills it after testing is complete.
- subprocess: The script uses spawn to launch the index.js process with modified environment variables.

## Dependents
No known dependents.

## Cross-References
No cross-references.
