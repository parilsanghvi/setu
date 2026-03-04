---
source_hash: 7b976b8122242c90
facts_hash: 1371d52fe412432a
generated_at: 2026-03-04T05:57:36.304Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-core-server-routes.js

## Purpose
This file tests the core server routes using Node.js testing utilities. It verifies that the API endpoints function correctly under various conditions, including hard gate bypasses and path traversal attempts. The `setupRoutes` function from the `../lib/routes` module is used to configure the Express app for these tests.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockLogger` | class | `` | A mock logger implementation with basic logging methods. |
| `mocks` | arrow | `{
    './middleware/auth': (req, res, next) => next(), // bypass auth for routing logic
    './onboarding/status': { getOnboardingStatus: () => gateStatus },
    './onboarding/governance-profiles': {
        getActiveProfile: () => ({ name: 'strict', config: { strict_diff: true } })
    },
    './onboarding/paths': {
        getSetuPath: (p) => path.join(__dirname, 'mock_paths', p) // fake path
    },
    './utils': {
        readLastLines: async () => ['{"ok": true, "drift_percent": 5, "missing_docs": ["foo.md"]}']
    },
    './db': {
        db: {
            prepare: (sql) => {
                if (sql.includes('agents')) return { all: () => [{ name: 'Agent1' }], get: () => ({ count: 1 }) };
                if (sql.includes('tasks')) return { all: () => [{ id: 'TASK-1' }], get: () => ({ count: 1 }) };
                return { all: () => [], get: () => ({}) }
            }
        },
        updateTask: (id, status, meta) => { lastTaskEmitted = { id, status, meta }; },
        send: (sender, recipient, message, type) => { lastMessageEmitted = { sender, recipient, message, type }; }
    }
} | 

## Internal Logic
The file uses a mocking approach to isolate the dependencies of the `setupRoutes` function. The main execution flow involves:

* Creating an Express app and setting up the mock logger.
* Calling the `setupRoutes` function with the app and logger as arguments.
* Verifying that the API endpoints return the expected responses.

Key functions include `fetchAPI`, which simulates making requests to the API endpoints, and `setupRoutes`, which configures the Express app for these tests. The `mocks` object provides mock implementations of various dependencies used by the `setupRoutes` function.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `express` | No | Provides a web framework for building server-side applications. |
| `fs` | No | Provides functions for interacting with the file system. |
| `http` | No | Provides an HTTP server implementation. |
| `module` | No | Provides utilities for working with modules and dependencies. |
| `node:assert` | No | Provides assertion functions for testing. |
| `node:test` | No | Provides utilities for writing unit tests. |
| `path` | No | Provides functions for working with file paths. |

## Side Effects
- database:
  * The `updateTask` function in the mock database updates the `lastTaskEmitted` variable with the latest task data.
* network: 
  * The `fetchAPI` function sends requests to the API endpoints, which may trigger network requests and responses.

## Dependents
No known dependents.

## Cross-References
- [routes.js](../lib/routes.js.md)
