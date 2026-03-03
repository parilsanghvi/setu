---
source_hash: 94cbdee7fdfe50ed
facts_hash: c584154d1535ebdd
generated_at: 2026-03-03T07:49:12.129Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-tasks-screenshots-security.js

## Purpose
This file tests the security features of a web server, specifically the protection against path traversal attacks on the `/api/tasks/:id/screenshots` endpoint.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `request` | arrow | `path` | Handles incoming requests to the test server. |
| `DashboardServer` | class | - | Creates a new instance of the DashboardServer class, which handles incoming requests and tests the security features. |

## Internal Logic
The file starts by mocking certain methods of the `fs` module to simulate the behavior of the real file system on the server. It then creates an instance of the `DashboardServer` class, which is responsible for handling incoming requests and testing the security features.

The main execution flow is as follows:

1. The file tests that a valid task ID with screenshots returns 200 and a list of files.
2. It tests that a valid task ID without screenshots returns 200 and an empty list.
3. It tests that a non-existent task ID returns 200 and an empty list (graceful degradation).
4. It tests that path traversal attempts return 400 Bad Request.
5. It tests that invalid characters ($, %2e%2e%2f) return 400 Bad Request.

The key functions in the file are:

* `request`: a helper function that sends an HTTP request to the test server and returns the response.
* `DashboardServer`: the main class that handles incoming requests and tests the security features.
* `fs.existsSync`, `fs.readdirSync`, and `fs.watchFile` are mocked methods of the `fs` module.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides testing utilities for Node.js. |
| `http` | No | Provides HTTP request functionality. |
| `path` | No | Provides path manipulation functionality. |
| `fs` | Yes | Provides file system functionality, which is mocked in this test. |

## Side Effects
- console_output: None.
- env_access: The file accesses the `process.env.DASHBOARD_PASS` environment variable to disable authentication for testing purposes.
- filesystem_read: The file reads and writes files to the `/screenshots` directory using the mocked `fs.existsSync`, `fs.readdirSync`, and `fs.watchFile` methods.
- global_mutation: The file mutates the `global.setInterval` function to prevent background tasks from running during the test.
- network: The file sends HTTP requests over the network to the test server.
- process_control: The file controls the process exit status by using a timeout and `process.exit(0)` at the end of the test.

## Dependents
No known dependents.

## Cross-References
- [server.js](../lib/server.js.md)
