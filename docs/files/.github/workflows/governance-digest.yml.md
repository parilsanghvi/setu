---
source_hash: 4f29899bbea1058b
facts_hash: d5c694d154fc31f6
generated_at: 2026-03-03T07:02:43.019Z
generator_version: 1.0.0
model: cheap
quality_score: 79
---
# File: .github/workflows/governance-digest.yml

## Purpose
This file defines a GitHub Actions workflow named "Governance Digest" that runs on Mondays at 9:00 AM UTC, producing a weekly digest report of governance actions.

## Exports / API Surface
| Name | Description |
| --- | --- |
| None detected | |

## Internal Logic
The main execution flow involves the following key functions:
- `Checkout Code`: Checks out the repository's code.
- `Setup Node`: Sets up a Node.js environment with version 18.
- `Verify Setup`: Verifies that the setup process has completed successfully.
- `Run Digest Report`: Generates and uploads a weekly governance digest report using the `setu` tool.

## Dependencies
| Name | Why |
| --- | --- |
| None detected | |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
