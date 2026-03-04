---
source_hash: 302df958454370e1
facts_hash: 4c9fa816934a5e6a
generated_at: 2026-03-04T05:48:50.395Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: scripts/onboarding-status.js

## Purpose
This file is responsible for checking the onboarding status of a system, generating a log entry with the current status, and updating the log file accordingly. It utilizes functions from the `onboarding/status` module to retrieve the onboarding status and determine the completeness of the artifacts present in the system. The resulting log entry is then written to a file named "onboarding-history.jsonl".

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `getOnboardingStatus` | function |  | Retrieves the onboarding status of the system. |
| `getActiveProfile` | function |  | Returns the active governance profile. |

## Internal Logic
The main execution flow of this file involves:
- Retrieving the onboarding status using the `getOnboardingStatus` function.
- Validating and filtering existing log entries based on a maximum record count and time threshold.
- Generating a new snapshot with the current timestamp, completeness, artifacts present, artifacts missing, missing documents count, and ok status.
- Writing the updated log entry to the "onboarding-history.jsonl" file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/governance-profiles` | Yes | Provides access to the active governance profile. |
| `../lib/onboarding/paths` | Yes | Supplies the path for writing to the log file. |
| `../lib/onboarding/status` | Yes | Imports the necessary functions for retrieving and processing onboarding status. |

## Side Effects
- console_output: The script logs the onboarding status to the console using `console.log`.
- env_access: The script accesses environment variables such as `SETU_DRIFT_HISTORY_MAX`, `SETU_DRIFT_HISTORY_DAYS`, and `CI` or `GITHUB_ACTIONS`.
- filesystem_read: The script reads the contents of the "onboarding-history.jsonl" file using `fs.readFileSync`.
- filesystem_write: The script writes to the "onboarding-history.jsonl" file using `fs.writeFileSync`.
- process_control: The script uses `process.exit` to control the program's exit status based on the onboarding status.

## Dependents
No known dependents.

## Cross-References
- [governance-profiles.js](../lib/onboarding/governance-profiles.js.md)
- [paths.js](../lib/onboarding/paths.js.md)
- [status.js](../lib/onboarding/status.js.md)
