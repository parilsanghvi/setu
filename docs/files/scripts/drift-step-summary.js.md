---
source_hash: d4d8832220dcc546
facts_hash: 5eff078ff64b3675
generated_at: 2026-03-03T07:28:55.430Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: scripts/drift-step-summary.js

## Purpose
This file, drift-step-summary.js, generates a Markdown report summarizing the results of a docs drift check. It verifies if there are any changes in the codebase and checks for missing documentation. The report also includes suggested reviewers and ownership information.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `if` | method | `result.ok` | Checks if the drift check was successful and exits with an error message otherwise. |
| `fs.appendFileSync` | function |  | Writes a message to a file indicating that an error occurred or exits the process. |

## Internal Logic
The main execution flow of this script involves checking for the existence of a 'drift.json' file, parsing its content, and generating a Markdown report based on the results. The key functions include:

- `fs.readFileSync` and `JSON.parse`: reads and parses the 'drift.json' file.
- `fs.appendFileSync`: writes the generated Markdown report to a file.
- The main logic is contained within the `if` statement, which checks the value of `result.ok` and generates the corresponding part of the Markdown report.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system operations. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The script logs error messages to the console using `console.error`.
- env_access: The script accesses environment variables, specifically `GITHUB_STEP_SUMMARY`, to determine the location of the summary file.
- filesystem_read: The script reads files from the file system, including 'drift.json' and 'artifacts/drift-report.md'.
- filesystem_write: The script writes messages to the file system using `fs.appendFileSync`.
- process_control: The script exits the process with an error code if any of the drift check fails or no 'drift.json' file is found.

## Dependents
No known dependents.

## Cross-References
No cross-references.
