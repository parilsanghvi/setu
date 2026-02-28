---
source_hash: 94cbdee7fdfe50ed
facts_hash: 294c5e3f704b1f3b
generated_at: 2026-02-25T12:30:41.892Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-tasks-screenshots-security.js

## Purpose
This file tests the security features of a web server, specifically the path traversal protection for the `/api/tasks/:id/screenshots` endpoint.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `test` | function |  | Defines a test suite for the web server's security features |
| `DashboardServer` | class |  | Represents the web server and provides methods for testing its functionality |
| `request` | arrow | `path` | Makes an HTTP request to the web server with the given path |
| `PORT` | arrow | 4003 | Sets the port number used by the web server |

## Internal Logic
The main execution flow of this file is as follows:
1. The test suite is defined using the `test` function, which creates a new instance of the `DashboardServer` class.
2. The `DashboardServer` class is initialized with the port number 4003.
3. The `request` function is used to make HTTP requests to the web server's `/api/tasks/:id/screenshots` endpoint with different paths and test cases.
4. Each request is handled by the web server, and the response is parsed and asserted against expected values.

Key functions:
- `test`: defines a test suite
- `DashboardServer`: represents the web server and provides methods for testing its functionality
- `request`: makes an HTTP request to the web server with the given path

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | Yes | Provides a testing framework for writing unit tests |
| `../lib/server` | Yes | Defines the structure and functionality of the web server being tested |
| `http` | No | Provides an HTTP client library for making requests to the web server |
| `fs` | No | Provides file system utilities, but not used in this test file |
| `node:assert` | No | Provides assertion utilities for testing, but not used directly in this file |

## Side Effects
- console_output: none
- env_access: sets and restores environment variables (e.g., `process.env.DASHBOARD_PASS`)
- filesystem_read: mocks the `fs.existsSync` method to simulate existence of directory contents
- global_mutation: mocks the `global.setInterval` function to prevent background tasks
- network: makes HTTP requests to the web server, which may involve network communication
- process_control: starts and stops the web server instance, which involves process management

## Dependents
No known dependents.

## Cross-References
- [server.js](../lib/server.js.md)
