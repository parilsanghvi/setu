---
source_hash: 70502a88746ef846
facts_hash: d5616a1705fe268e
generated_at: 2026-03-04T06:08:49.611Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-tasks-api.js

## Purpose
This file tests the /api/tasks endpoint of the DashboardServer class, which handles incoming requests and sends responses with specific headers and body content.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| req    | arrow | `http.request(options, (res` | Handles incoming HTTP requests to the /api/tasks endpoint. |
| options| object | `hostname: 'localhost', ...` | Defines the request options for sending data to the server. |
| res    | arrow | `'data', (chunk` | Processes and sends responses from the server. |

## Internal Logic
The file executes the following main flow:
1. The DashboardServer class is instantiated with a port number, starting the server.
2. A POST request is sent to the /api/tasks endpoint with a JSON payload using the http.request function.
3. The response data is captured and parsed from the server.
4. Assertions are used to verify the status code and expected values in the response.
5. If an error occurs during assertion, the test exits with a failure message.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/server` | Yes | Provides the DashboardServer class for testing. |
| `../lib/onboarding/status` | Yes | Mocks the onboarding status to pass the hard gate during testing. |
| `assert` | No | Provides assertion utilities for verifying response values. |
| `http` | No | Provides HTTP request functionality for sending data to the server. |

## Side Effects
- console_output: The test logs success or failure messages to the console using console.error and console.log.
- env_access: The test sets an environment variable DASHBOARD_PASS to a secret value during testing.
- network: The test sends an HTTP request to the localhost server at port 4002.
- process_control: The test captures and restores the original stderr write function to detect any "headers already sent" errors.

## Dependents
No known dependents.

## Cross-References
- [status.js](../lib/onboarding/status.js.md)
- [server.js](../lib/server.js.md)
