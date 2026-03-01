---
source_hash: 3ed1873873ed4425
facts_hash: 12d0d5be2abd7a55
generated_at: 2026-02-25T12:14:40.688Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: scripts/onboarding-status.js

## Purpose
This file is responsible for fetching and logging the onboarding status, as well as maintaining a history of previous onboarding events. It retrieves the current onboarding status using `getOnboardingStatus` from `../lib/onboarding/status`, then logs this status to an onboarding history JSONL file. The script also limits the number of records in the log file to prevent it from growing indefinitely.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getOnboardingStatus` | function | - | Retrieves and returns the current onboarding status. |
| `getSetuPath` | function | 'onboarding-history.jsonl' | Returns the path to the onboarding history JSONL file. |

## Internal Logic
The main execution flow of this script can be broken down into several key functions:
- `getOnboardingStatus`: Retrieves and returns the current onboarding status from `../lib/onboarding/status`.
- `getActiveProfile` (imported from `../lib/onboarding/governance-profiles`): Retrieves the active governance profile.
- The main function: This is where the script's logic is executed. It first checks if the log file exists, then reads its contents and filters out any lines that are older than a specified maximum number of days. If the log file does not exist, it creates a new directory to store the file. Finally, it appends a new line to the end of the log file containing the current onboarding status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/status` | Yes | Provides the logic for determining the onboarding status. |
| `../lib/onboarding/governance-profiles` | Yes | Needed to retrieve the active governance profile. |
| `../lib/onboarding/paths` | Yes | Required to get the path to the onboarding history JSONL file. |
| `fs` | No | Provides the functionality for interacting with the file system. |
| `path` | No | Used to manipulate file paths. |

## Side Effects
- console_output: The script logs the current onboarding status to the console in a human-readable format.
- env_access: The script accesses environment variables such as `SETU_DRIFT_HISTORY_MAX` and `SETU_DRIFT_HISTORY_DAYS`.
- filesystem_read: The script reads the contents of the onboarding history JSONL file from disk.
- filesystem_write: The script writes new data to the end of the onboarding history JSONL file, potentially overwriting existing content.
- process_control: If the onboarding status is not OK, the script exits the process with a non-zero exit code.

## Dependents
No known dependents.

## Cross-References
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [paths.js](../lib/onboarding/paths.js.md)
- [status.js](../lib/onboarding/status.js.md)
