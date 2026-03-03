---
source_hash: 302df958454370e1
facts_hash: b3ffa7d5926f9fbf
generated_at: 2026-03-03T07:29:33.047Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: scripts/onboarding-status.js

## Purpose
This file generates an onboarding status report and writes it to a log file, while also handling errors silently in CI/GitHub Actions environments.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getOnboardingStatus` | function | Object | Retrieves the current onboarding status. |
| `fs.readFileSync` | function | String | Reads the contents of a file asynchronously. |
| `fs.writeFileSync` | function | String | Writes the contents of a string to a file synchronously. |
| `process.exit` | method | Number | Exits the process with a specified exit code. |

## Internal Logic
The main execution flow of this script involves:
1. Retrieving the current onboarding status using the `getOnboardingStatus` function.
2. Checking if the log file exists and reading its contents.
3. Filtering out old records based on the maximum number of days and records.
4. Creating a new snapshot with the current timestamp and onboarding status data.
5. Writing the updated log lines to the file.

Key functions include:
- `getOnboardingStatus`: Retrieves the current onboarding status from the `onboarding/status` module.
- `fs.readFileSync` and `fs.writeFileSync`: Read and write files asynchronously and synchronously, respectively.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/governance-profiles` | Yes | Provides access to governance profiles for setting max records and days. |
| `../lib/onboarding/paths` | Yes | Offers a utility function to get the setup path for log file management. |
| `../lib/onboarding/status` | Yes | Supplies the onboarding status data used in the script. |

## Side Effects
- console_output: The script logs the onboarding status report to the console using `console.log`.
- env_access: The script accesses environment variables such as `SETU_DRIFT_HISTORY_MAX`, `SETU_DRIFT_HISTORY_DAYS`, and `CI` or `GITHUB_ACTIONS` for conditional logic.
- filesystem_read: The script reads the contents of the log file using `fs.readFileSync` and writes new data to it using `fs.writeFileSync`.
- filesystem_write: New lines are written to the log file in append mode.
- process_control: The script exits the process with a specified code (0 for success, 1 for failure) using `process.exit`.

## Dependents
No known dependents.

## Cross-References
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [paths.js](../lib/onboarding/paths.js.md)
- [status.js](../lib/onboarding/status.js.md)
