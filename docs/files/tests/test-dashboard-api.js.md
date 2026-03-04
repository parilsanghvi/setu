---
source_hash: 64692dbeff16f7e3
facts_hash: 7df5e4dcde609464
generated_at: 2026-03-04T05:58:17.812Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-dashboard-api.js

## Purpose
This file contains test cases for the Dashboard API integration, ensuring that various endpoints function correctly and return expected data.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `makeRequest` | function | `port, method, path, body = null, auth = true` | Handles incoming requests to the server. |
| `mockDb` | arrow | `{ db: { prepare: (sql) => { ... } } }` | Mocks the database implementation for testing purposes. |
| `mockUtils` | arrow | `{ readLastLines: async () => {} }` | Mocks utility functions for testing purposes. |

## Internal Logic
The main execution flow of this file is as follows:

1. The test suite initializes by setting up an instance of the DashboardServer class and starting it on a random port.
2. It then defines several test cases that exercise different endpoints of the API, including:
	* Auth check: Verifies that requesting the stats endpoint without authentication returns a 401 status code.
	* Stats endpoint: Tests that retrieving the stats returns expected data, including agent counts and task counts.
	* Agents endpoint: Verifies that fetching agents returns an accurate list.
	* Tasks endpoint: Ensures that fetching tasks returns the correct list of tasks.
	* Chat endpoint: Validates that sending a message via the chat endpoint sends it successfully and updates the database accordingly.
3. After each test case, the server is stopped to ensure that no lingering requests are processed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `http` | No | Provides a way to make HTTP requests for testing purposes. |
| `module` | Yes | Essential for importing and manipulating modules in Node.js. |

## Side Effects
- console_output: The test suite logs messages to the console using `console.log()` and `assert.strictEqual()`, which may output data.
- database: The mock database implementation (`mockDb`) is accessed and updated during the tests, causing changes to be reflected in the simulated database.
- env_access: The file accesses environment variables (e.g., `process.env.DASHBOARD_PASS`), but does not modify them.
- network: The test suite establishes a connection with the server over the network using `http.request()`, sending and receiving data between the client and server.

## Dependents
No known dependents.

## Cross-References
- [server.js](../lib/server.js.md)
