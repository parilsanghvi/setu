---
source_hash: 94cbdee7fdfe50ed
facts_hash: 52627c0004912907
generated_at: 2026-03-04T06:09:11.691Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-tasks-screenshots-security.js

## Purpose
This file tests the security of a server's `/api/tasks/:id/screenshots` path by verifying that it correctly handles various types of input, including valid and invalid task IDs, path traversal attempts, and characters.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `DashboardServer` | function |  | Creates a new instance of the Dashboard server class. |
| `test` | arrow |  | Runs a test suite for the security functionality. |
| `request` | arrow | `path` | Makes an HTTP request to the server. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `test` function creates a new instance of the `DashboardServer` class and starts the server.
2. The test suite consists of several tests that verify the security functionality of the `/api/tasks/:id/screenshots` path.
3. Each test uses the `request` function to make an HTTP request to the server with a specific path parameter.
4. The test checks the response status code, headers, and data to ensure that it is correct and secure.

The key functions in this file are:

* `test`: Runs a test suite for the security functionality.
* `DashboardServer`: Creates a new instance of the Dashboard server class.
* `request`: Makes an HTTP request to the server.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | Yes | Provides a testing framework. |
| `../lib/server` | Yes | Provides the server implementation. |
| `http` | No | Provides low-level networking functionality. |
| `fs` | No | Provides file system functionality. |
| `node:assert` | No | Provides assertion utilities. |

## Side Effects
- console_output: The test suite logs messages to the console for debugging purposes.
- env_access: The test suite accesses environment variables to configure the server.
- filesystem_read: The test suite reads files from the file system to verify the security functionality.
- global_mutation: The test suite mutates global variables to mock out certain dependencies.
- network: The test suite establishes a network connection to the server for testing.
- process_control: The test suite controls the process flow by waiting for the server to shut down after each test.

## Dependents
No known dependents.

## Cross-References
- [server.js](../lib/server.js.md)
