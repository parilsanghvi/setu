---
source_hash: 352f6c56b626f394
facts_hash: b2176e1bf7191265
generated_at: 2026-03-04T05:45:21.578Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: lib/routes/api.js

## Purpose
This file sets up API routes for an application, defining how the system responds to various requests and providing functionality such as retrieving onboarding status, historical trend data, and task-related information.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `setupApiRoutes` | cjs_named | Sets up API routes for the application. |

## Internal Logic
The main execution flow involves setting up API endpoints for various requests, including retrieving onboarding status, historical trend data, and task-related information.

- Key functions:
  - `setupApiRoutes`: Sets up all API endpoints.
  - `getOnboardingStatus`, `getSetuPath`, `readLastLines`: Used within API endpoints to retrieve or calculate specific data.
  - `db.db.prepare` and related methods: Interact with the database to retrieve or update data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../db` | Yes | Provides database interaction utilities. |
| `../onboarding/governance-profiles` | Yes | Allows access to governance profiles for active profiles. |
| `../onboarding/paths` | Yes | Retrieves paths for onboarding-related files. |
| `../onboarding/status` | Yes | Uses the onboarding status API. |
| `../utils` | Yes | Offers utility functions like reading last lines from a file. |

## Side Effects
- Database:
  - Updates or retrieves data from the database, including task information and governance profile.
- Filesystem_read:
  - Reads files from the filesystem to retrieve screenshots for tasks or historical trend data.

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- [governance-profiles.js](../onboarding/governance-profiles.js.md)
- [paths.js](../onboarding/paths.js.md)
- [status.js](../onboarding/status.js.md)
- [utils.js](../utils.js.md)
