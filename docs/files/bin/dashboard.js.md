---
source_hash: b2f114cc77e6c52c
facts_hash: 08c00bd315a858ac
generated_at: 2026-03-04T05:27:13.781Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: bin/dashboard.js

## Purpose
This file is the main entry point for the Setu dashboard, responsible for setting up and rendering the GUI components, fetching data from the database, and refreshing the display at regular intervals.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getCpuUsage` | function | `` | Calculates CPU usage statistics. |
| `refreshData` | function | `` | Periodically refreshes data and updates the GUI display. |
| `getOnboardingStatus` | function | `` | Retrieves onboarding status information from the database. |
| `getActiveProfile` | function | `` | Retrieves active governance profile information from the database. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `refreshData` function is called at regular intervals to update the GUI display.
2. Within `refreshData`, data is fetched from the database using various queries.
3. The fetched data is then used to update the corresponding GUI components, such as the agent table and onboarding status box.
4. The `getCpuUsage` function calculates CPU usage statistics, which are used to update the system gauge.
5. If necessary, the `getOnboardingStatus` and `getActiveProfile` functions are called to retrieve additional data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides database connection functionality. |
| `../lib/onboarding/status` | Yes | Offers onboarding status information retrieval. |
| `../lib/onboarding/governance-profiles` | Yes | Supplies active governance profile data. |

## Side Effects
- Database: The file updates the database by executing queries to fetch and update data.
- Filesystem_read: The file reads from files in the filesystem, including log files and JSONL files containing historical data.
- Process_control: The file uses process control functions to set up event listeners for changes in the log file and to refresh the display at regular intervals.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [status.js](../lib/onboarding/status.js.md)
