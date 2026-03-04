---
source_hash: 5f355f2c3c2b099b
facts_hash: 62be7c496f635d0f
generated_at: 2026-03-04T05:45:46.745Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: lib/routes.js

## Purpose
This file, `lib/routes.js`, sets up the routes for an Express.js application. It handles authentication, serves static files, and provides APIs for onboarding status, historical trend, drift trend, stats, tasks, agents, creating tasks, deleting tasks, updating tasks, and chatting with agents.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `authMiddleware` | function | Applies authentication middleware to protect routes |
| `setupRoutes` | cjs_default | Sets up the routes for the Express.js application |

## Internal Logic
The main execution flow of this file is to set up the Express.js application by defining various routes and their corresponding handlers. The key functions are:
- `setupRoutes`: sets up the routes for the Express.js application.
- `helmet`: applies security headers to protect against common web attacks.
- `authMiddleware`: applies authentication middleware to protect sensitive routes.
- Various API endpoints, such as `/api/onboarding`, `/api/drift-trend`, and `/api/tasks`, which handle requests related to onboarding status, drift trend, and tasks.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./db` | Yes | Provides database interaction utilities |
| `./middleware/auth` | Yes | Applies authentication middleware to protect routes |
| `./onboarding/governance-profiles` | Yes | Provides governance profiles for onboarding status |
| `./onboarding/paths` | Yes | Provides path utilities for onboarding files |
| `./onboarding/status` | Yes | Provides onboarding status utilities |
| `./utils` | Yes | Provides utility functions, such as reading last lines of a file |

## Side Effects
- database: Various database interactions occur through the use of the `db` module, including selecting data and updating records.
- filesystem_read: The `/api/tasks/:id/screenshots` endpoint reads files from the filesystem to return screenshot URLs.
- subprocess: The `/api/git/commit` endpoint runs a subprocess to execute a Git command.

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
