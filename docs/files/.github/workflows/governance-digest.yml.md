---
source_hash: 4f29899bbea1058b
facts_hash: 844bdf5a342457b0
generated_at: 2026-02-25T11:52:30.817Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: .github/workflows/governance-digest.yml

## Purpose
This file defines a GitHub Actions workflow named "Governance Digest" that runs on Mondays at 9:00 AM UTC, which generates and uploads a weekly governance digest report.

## Exports / API Surface
| Name | Description |
| --- | --- |
| None | - |

## Internal Logic
The main execution flow of this file consists of the following steps:
- Checkout Code: Checks out the code repository.
- Setup Node: Installs Node.js version 18 for use in the workflow.
- Verify Setup: Verifies that the setup script is executable by running `chmod +x bin/setu`.
- Run Digest Report: Runs a command to generate and save the governance digest report using the `./bin/setu` script.
- Upload Artifact: Uploads the generated digest report as an artifact for future reference.

## Dependencies
| Name | Why |
| --- | --- |
| actions/checkout@v4 | Allows GitHub Actions to check out the code repository. |
| actions/setup-node@v3 | Installs Node.js version 18 for use in the workflow. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
