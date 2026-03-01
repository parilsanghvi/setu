---
source_hash: b2f114cc77e6c52c
facts_hash: d402b9c03780cc66
generated_at: 2026-02-25T11:56:47.412Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: bin/dashboard.js

## Purpose
This file, `bin/dashboard.js`, is the main entry point for the Setu dashboard application, responsible for rendering and updating its various components, including system gauge, active agents table, log tail, telemetry trend, and task kanban.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getCpuUsage` | function | `` | Calculates CPU usage percentage. |
| `refreshData` | function | `` | Updates the dashboard data and renders it on the screen. |
| `setInterval` | method | `1000` | Schedules a recurring task to run every 1 second. |

## Internal Logic
The main execution flow of this file involves several key functions:
- The constructor initializes the screen, grid, and various components.
- `refreshData()` is called repeatedly using `setInterval`, which fetches data from the database and updates the relevant components (system gauge, active agents table, log tail, telemetry trend, and task kanban).
- The loop iterates over each component, updating its data and rendering it on the screen.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides database access for fetching data. |
| `../lib/onboarding/governance-profiles` | Yes | Offers governance profiles for managing onboarding. |
| `../lib/onboarding/status` | Yes | Offers onboarding status updates and processing. |

## Side Effects
- Database: The file interacts with the database to fetch data, update it, and store changes.
- filesystem_read: The file reads from the log file to display its contents and updates when new lines are added.
- process_control: The `setInterval` function is used to control the refresh rate of the dashboard.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [status.js](../lib/onboarding/status.js.md)
