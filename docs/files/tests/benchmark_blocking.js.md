---
source_hash: 35bfbd76c566c2a2
facts_hash: 1ddd09e0fc1936f8
generated_at: 2026-03-04T05:50:33.371Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/benchmark_blocking.js

## Purpose
This file contains a benchmarking function `runBenchmark` that generates a large session file, starts a server, and measures the response time of two concurrent requests: one to download a large file and another to fetch statistics from the server. The test helps evaluate the performance of the server under heavy loads.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `generateSessionFile` | function | `` | Generates a large session file by writing a JSON object string repeatedly. |
| `if` | method | `res.ok` | Checks if an HTTP response is OK and throws an error if it's not. |
| `runBenchmark` | function | `` | Runs the benchmarking test, including generating a session file, starting a server, waiting for it to be ready, making concurrent requests, and measuring the response times. |
| `startServer` | function | `` | Starts a server by spawning a new process with the specified command and environment variables. |
| `waitForServer` | function | `` | Waits for the server to be ready by checking its statistics API endpoint periodically until it responds successfully. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `runBenchmark` function generates a large session file using `generateSessionFile`.
2. It starts a server using `startServer`, which spawns a new process with the specified command and environment variables.
3. It waits for the server to be ready by checking its statistics API endpoint periodically using `waitForServer`. This ensures that the server is responsive before making concurrent requests.
4. Once the server is ready, it makes two concurrent requests: one to download a large file and another to fetch statistics from the server.
5. The response times of these two requests are measured and logged.

Key functions include:

* `generateSessionFile`: generates a large session file by writing a JSON object string repeatedly.
* `startServer`: starts a server by spawning a new process with the specified command and environment variables.
* `waitForServer`: waits for the server to be ready by checking its statistics API endpoint periodically until it responds successfully.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities, such as creating write streams. |
| `http` | No | Provides HTTP request and response objects for making requests to the server. |
| `path` | No | Provides path manipulation utilities, such as joining directory paths. |

## Side Effects
- console_output: The script logs messages to the console, including success messages, error messages, and progress updates.
- env_access: The script accesses environment variables, such as `PORT` and `DISABLE_DASHBOARD_AUTH`, to configure the server.
- filesystem_read: The script reads files from the file system, including generating a large session file by writing to a JSON object string repeatedly.
- filesystem_write: The script writes data to the file system by creating a write stream for the session file.
- network: The script makes HTTP requests over the network to fetch statistics and download a large file from the server.
- subprocess: The script spawns a new process using `child_process` to start the server, allowing it to run concurrently with other tasks.

## Dependents
No known dependents.

## Cross-References
No cross-references.
