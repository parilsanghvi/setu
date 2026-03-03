---
source_hash: 70502a88746ef846
facts_hash: bd111046fe857b4a
generated_at: 2026-03-03T07:48:44.754Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-tasks-api.js

## Purpose
This file tests the /api/tasks endpoint of a dashboard server, sending a POST request with sample task data and verifying the response status and contents.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `DashboardServer` | class | - | Creates a new dashboard server instance |
| `statusModule` | module | - | Provides mock onboarding status functionality |

## Internal Logic
The main execution flow involves:
1. Creating a new dashboard server instance using the `DashboardServer` class.
2. Starting the server and capturing its stderr output to detect any errors.
3. Defining a POST request options object with sample task data and headers.
4. Creating an HTTP request using the options object.
5. Handling the response data and verifying its status and contents using assertions.
6. Closing the server instance when finished.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/status` | Yes | Mocks onboarding status for testing purposes |
| `../lib/server` | Yes | Provides the server class to create and manage a dashboard server |
| `http` | No | Used to create an HTTP request object |

## Side Effects
- console_output: The script logs console messages indicating test success or failure, as well as any error messages.
- env_access: The script accesses the `DASHBOARD_PASS` environment variable to set a mock authentication token for testing purposes.
- network: The script establishes an HTTP connection to the dashboard server instance at the specified port.
- process_control: The script captures and restores process stderr output to detect any errors that might be reported in the standard error stream.

## Dependents
No known dependents.

## Cross-References
- [status.js](../lib/onboarding/status.js.md)
- [server.js](../lib/server.js.md)
