---
source_hash: b2f114cc77e6c52c
facts_hash: 6af3ca91345b66f5
generated_at: 2026-03-03T07:07:49.832Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: bin/dashboard.js

## Purpose
This file implements the dashboard of a system management tool, displaying various metrics and data in real-time using a terminal user interface (TUI). The `refreshData` function is responsible for fetching and updating data from the database and filesystem, while also handling log streaming and process control.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getCpuUsage` | function | `` | Returns the current CPU usage as a percentage. |
| `agentData` | arrow | `agents.map(a => [a.name, a.role, a.status, a.pid || '-'])` | Maps agent data to displayable format. |
| `allRuns` | arrow | `lines.map(l => try { return JSON.parse(l); } catch (e) { return null; })` | Parses log lines and returns an array of objects. |
| `fails` | arrow | `last20.filter(r => !r.ok)` | Filters out successful logs from the last 20 entries. |
| `taskData` | arrow | `tasks.map(t => [t.id, t.status, t.owner, t.title.substring(0, 25)])` | Maps task data to displayable format. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `refreshData` function is called every second using `setInterval`.
2. It first fetches the CPU usage by calling `getCpuUsage`.
3. Then, it updates the agent table with data from the database.
4. Next, it retrieves onboarding status and telemetry trend data from the filesystem.
5. After that, it updates the log box with new log entries.
6. Finally, it renders the TUI screen.

Key functions:

* `getCpuUsage`: Returns the current CPU usage as a percentage.
* `refreshData`: Fetches and updates data from the database and filesystem.
* `agentTable.setData` and `taskList.setData`: Update the agent table and task list with fetched data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides database connection utilities. |
| `../lib/onboarding/governance-profiles` | Yes | Offers governance profile data. |
| `../lib/onboarding/status` | Yes | Supplies onboarding status data. |

## Side Effects
- Database: The `refreshData` function updates the agent table and task list with data from the database.
- Filesystem_read: The file reads log entries from the filesystem every second using `fs.watchFile`.
- Process_control: The file uses `setInterval` to refresh the dashboard every second, which affects process control.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [status.js](../lib/onboarding/status.js.md)
