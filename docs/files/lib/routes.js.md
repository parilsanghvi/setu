---
source_hash: fe95a73d6c77ff17
facts_hash: a944c1bbea300a59
generated_at: 2026-03-03T07:26:13.386Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/routes.js

## Purpose
This file exports a single function, `setupRoutes`, which sets up the routing configuration for an Express.js application. It handles incoming requests and returns responses for various API endpoints, including onboarding status, tasks, agents, and more. The setup process includes configuring security headers, authentication middleware, serving static files, and setting up database connections.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `setupRoutes` | cjs_default | Sets up the routing configuration for an Express.js application |

## Internal Logic
The main execution flow of this file is to set up the Express.js application with various middleware and routes. The key functions include:
- `setupRoutes`: This function takes in an `app` object (which is assumed to be an instance of Express) and a `logger` object, and configures the routing for the application.
  - It sets up security headers using the `helmet` middleware.
  - It applies authentication middleware using the `authMiddleware` imported from `./middleware/auth`.
  - It serves static files from the `screenshots` directory and from the `frontend/dashboard` directory.
  - It defines several API endpoints, including onboarding status, tasks, agents, and chat functionality.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./db` | Yes | Manages database connections for the application |
| `./middleware/auth` | Yes | Applies authentication middleware to protect certain routes |
| `./onboarding/governance-profiles` | Yes | Provides access to governance profiles and active profile information |
| `./onboarding/paths` | Yes | Resolves paths for onboarding-related files and directories |
| `./onboarding/status` | Yes | Retrieves the current onboarding status of the application |
| `./utils` | Yes | Provides helper utilities, such as reading last lines from a file |

## Side Effects
- database:
  - The `setupRoutes` function uses the `db` object to interact with the database.
  - It executes database queries using the `db.db.prepare()` method to retrieve agent and task counts for the `/api/stats` endpoint.
- filesystem_read: 
  - The `setupRoutes` function reads files from the file system using the `fs` module's `promises` API to serve screenshots for tasks.

## Dependents
- [server.js](./server.js.md)

## Cross-References
- [db.js](./db.js.md)
- [auth.js](./middleware/auth.js.md)
- [governance-profiles.js](./onboarding/governance-profiles.js.md)
- [paths.js](./onboarding/paths.js.md)
- [status.js](./onboarding/status.js.md)
- [utils.js](./utils.js.md)
- [server.js](./server.js.md)
