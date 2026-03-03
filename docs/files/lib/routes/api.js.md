---
source_hash: 352f6c56b626f394
facts_hash: 674d856b32cc58ca
generated_at: 2026-03-03T07:25:48.256Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: lib/routes/api.js

## Purpose
This file exports the `setupApiRoutes` function, which sets up API routes for an Express.js application, including endpoints for onboarding status, historical trend, drift trend, stats, tasks, agents, create task, get screenshots for task, and chat with agent.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| setupApiRoutes | cjs_named | Sets up API routes for the Express.js application |

## Internal Logic
The main execution flow of this file is as follows:
- The `setupApiRoutes` function takes an Express.js app and a logger as arguments.
- It defines several API endpoints, including:
  - `/api/onboarding`: Returns the current onboarding status.
  - `/api/onboarding-trend`: Returns the historical trend of onboarding runs.
  - `/api/drift-trend`: Returns the drift trend and other statistics for onboarding runs.
  - `/api/stats`: Returns some basic statistics about the application's state.
  - `/api/tasks`: Returns a list of all tasks in the system.
  - `/api/agents`: Returns a list of all agents in the system.
  - `/api/tasks`: Creates a new task and returns its ID.
  - `/api/tasks/:id/screenshots`: Returns a list of screenshots for a given task.
  - `/api/chat`: Starts a chat with an agent.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| setupApiRoutes | Yes | 
| express | No | 
| db | Yes | Provides database interactions |
| onboarding/governance-profiles | Yes | 
| onboarding/paths | Yes | 
| onboarding/status | Yes | 
| utils | Yes | 
| fs | No | 

## Side Effects
- database: The API endpoints interact with the database to retrieve and update data.
- filesystem_read: Some of the API endpoints, such as `/api/tasks/:id/screenshots`, read files from the file system.

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- [governance-profiles.js](../onboarding/governance-profiles.js.md)
- [paths.js](../onboarding/paths.js.md)
- [status.js](../onboarding/status.js.md)
- [utils.js](../utils.js.md)
