---
source_hash: 35bfbd76c566c2a2
facts_hash: 8eab3e01eb6a93df
generated_at: 2026-02-25T12:16:14.790Z
generator_version: 1.0.0
model: cheap
quality_score: 79
---
# File: tests/benchmark_blocking.js

## Purpose
This file contains a benchmarking script that generates a large JSONL session file and measures the performance of a server by making concurrent requests to the server's stats API and the large file. The `runBenchmark` function is the main entry point, which starts the server, waits for it to be ready, makes concurrent requests, and logs the results.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| generateSessionFile | function | `` | Generates a large JSONL session file. |
| startServer | function | `` | Starts the server by spawning a new process. |
| waitForServer | function | `` | Waits for the server to be ready before making requests. |
| runBenchmark | function | `` | Runs the benchmarking script and measures the performance of the server's stats API. |

## Internal Logic
The main execution flow of this file is as follows:
- The `runBenchmark` function generates a large JSONL session file using `generateSessionFile`.
- It starts the server using `startServer`, which spawns a new process that runs the `index.js` script.
- It waits for the server to be ready using `waitForServer`, which makes requests to the server's stats API until it returns a successful response.
- Once the server is ready, it makes concurrent requests to the server's stats API and the large file using `fetch`.
- The results of these requests are logged to the console.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides functions for interacting with the file system. |
| path | No | Provides utilities for working with file paths. |
| http | No | Provides an HTTP client that is used to make requests to the server's stats API and large file. |
| child_process | No | Provides a way to spawn new processes, which is used to start the server. |

## Side Effects
- console_output: The script logs messages to the console at various points during its execution.
- env_access: The script accesses environment variables, such as `PORT` and `DISABLE_DASHBOARD_AUTH`, to configure the server.
- filesystem_read: The script reads files from disk using `fs.readFileSync` (not used in this code snippet), but does not write to file in a way that is explicitly documented here. However, it is mentioned that the `generateSessionFile` function writes to a file.
- filesystem_write: The script generates and writes a large JSONL session file using `fs.createWriteStream`.
- network: The script makes requests over the network to the server's stats API and large file using `fetch`.
- subprocess: The script starts a new process by spawning a child process using `spawn`, which runs the `index.js` script.

## Dependents
No known dependents.

## Cross-References
No cross-references.
