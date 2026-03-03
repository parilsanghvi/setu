---
source_hash: 4477b9a9edbe55b8
facts_hash: c3bbe308291025ec
generated_at: 2026-03-03T07:46:42.718Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-server-error-handling.js

## Purpose
This file tests the server error handling functionality of the `DashboardServer` class, verifying that it returns a generic "Internal Server Error" message and logs the detailed error internally.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| expressMock | arrow | `` | Mocks the Express.js module. |
| app | arrow | `{ use: () => { }, get: function (path, handler) { ... }, post: function (path, handler) { ... } }` | Exposes an instance of the mocked Express application with `use`, `get`, and `post` methods. |
| error | method | `msg` | Returns an error message when called with a message. |
| info | method | `` | Logs a message to the internal logger. |

## Internal Logic

The test file first sets up a mock environment using the `expressMock` function, which creates a mocked Express application instance. It then requires the `DashboardServer` class from `../lib/server` and creates an instance of it.

Next, it sets up a mock request and response object to simulate an incoming request to the server's route `/api/onboarding`. The test then triggers the vulnerable endpoint by calling the handler function associated with the route.

The test then checks that the expected error status code (500) is returned in the response body. If not, it logs an error message indicating that the error message leaked. It also verifies that the detailed error message is logged internally using the `Logger` class.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| module | Yes | Provides functions for working with modules. |
| assert | No | Used to assert conditions during testing, but not used in this specific file. |

## Side Effects

- console_output: The test logs error messages to the console when an insecure error message is found or when the detailed error is not logged.
- database: None
- process_control: The test exits the process with a non-zero exit code if any of the verification checks fail.

## Dependents
No known dependents.

## Cross-References
- [server.js](../lib/server.js.md)
