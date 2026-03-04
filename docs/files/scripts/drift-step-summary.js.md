---
source_hash: d4d8832220dcc546
facts_hash: 3ac082dcdbde9ca6
generated_at: 2026-03-04T05:48:11.705Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: scripts/drift-step-summary.js

## Purpose
This file generates a summary report of drifts in the system's documentation, indicating the percentage of drift detected, missing documents, and suggested reviewers. It also provides instructions on how to fix the drift and includes context and review information.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `summary` | function | `path, markdown` | Generates a summary report of drifts |
| `driftJsonPath` | variable | - | Path to the drift.json file |

## Internal Logic
The main execution flow involves:
- Checking if the drift.json file exists and parsing its contents.
- Generating the Markdown report based on the parsed data.
- Writing the report to a file.

Key functions include:
- `try` block: catches errors during JSON parsing and file access.
- `fs.readFileSync` and `fs.appendFileSync`: read and write files, respectively.
- `JSON.parse` and `String.prototype.replace`: parse and manipulate JSON data.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides functions for file system interactions |
| `path` | No | Provides utilities for working with file paths |

## Side Effects
- console_output: The script outputs error messages to the console when necessary.
- env_access: The script accesses environment variables, such as `GITHUB_STEP_SUMMARY`, to determine the report path.
- filesystem_read: The script reads files, including drift.json and summary reports.
- filesystem_write: The script writes files, including summary reports and artifacts directories.
- process_control: The script controls the process flow by checking for errors and exiting with a non-zero status code when necessary.

## Dependents
No known dependents.

## Cross-References
No cross-references.
