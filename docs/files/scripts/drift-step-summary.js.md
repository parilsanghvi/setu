---
source_hash: d4d8832220dcc546
facts_hash: a11c4b8fd7d412a6
generated_at: 2026-02-25T12:13:58.363Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: scripts/drift-step-summary.js

## Purpose
This file, drift-step-summary.js, is a script that generates a summary report of the drift detection results in a Drift project. It parses the drift.json file, checks for any changes, and provides detailed information about the detected drift. The report is then written to a markdown file.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `summaryPath` | string | - | Gets or sets the path to the summary report file |
| `driftJsonPath` | string | - | Gets or sets the path to the drift.json file |
| `result` | object | - | Parses and returns the contents of the drift.json file |

## Internal Logic
The main execution flow of this script is as follows:
- It first checks if the GITHUB_STEP_SUMMARY environment variable is set, and if not, it exits with an error.
- Then, it checks if the drift.json file exists at the specified path. If not, it appends a message to the summary report file indicating that the file was not found.
- Next, it attempts to parse the contents of the drift.json file using JSON.parse(). If this fails, it appends an error message to the summary report file and exits with an error.
- After parsing the file, it generates the markdown report based on the contents of the result object. This includes checking for any changes, identifying missing files, suggesting reviewers, and providing additional context such as base reference and strict diff warnings.
- Finally, it appends the generated markdown report to the summary report file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system operations |
| `path` | Yes | Provides path manipulation utilities |

## Side Effects
- console_output: 
  - The script outputs error messages to the console if the drift.json file is not found or if there is an issue parsing its contents.
  - It also outputs a success message when the report generation is complete.
- env_access: 
  - The script accesses the GITHUB_STEP_SUMMARY environment variable to determine the path of the summary report file.
- filesystem_read: 
  - The script reads the contents of the drift.json file from disk using fs.readFileSync().
  - It also reads and writes files to disk using fs.appendFileSync() and fs.writeFileSync().
- filesystem_write: 
  - The script appends new content to existing files on disk, such as the summary report file.
- process_control: 
  - The script exits with an error if there is an issue parsing the drift.json file or if the GITHUB_STEP_SUMMARY environment variable is not set.

## Dependents
No known dependents.

## Cross-References
No cross-references.
