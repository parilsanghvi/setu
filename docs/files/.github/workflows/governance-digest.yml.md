---
source_hash: 4f29899bbea1058b
facts_hash: 0a74680a6409b2e2
generated_at: 2026-03-04T07:11:29.274Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: .github/workflows/governance-digest.yml

## Purpose
This YAML file defines a GitHub Actions workflow named "Governance Digest" that runs weekly on Mondays at 9:00 AM UTC. It triggers the `digest` job, which generates a digest report for governance-related activities and uploads it as an artifact to GitHub. The report is stored in the `artifacts/digest.md` file.

## Exports / API Surface
| Export | Description |
| --- | --- |
| None detected. |

## Internal Logic
The workflow's main execution flow consists of several steps:

*   The `Checkout Code` step checks out the repository code.
*   The `Setup Node` step sets up a Node.js environment with version 18.
*   The `Verify Setup` step verifies that the setup process was successful by checking if the `bin/setu` executable has execute permissions. Although this is not part of the main workflow logic, it is used in the `Run Digest Report` job.
*   The `Run Digest Report` job runs the `setu onboarding doctor --digest-weekly` command to generate a digest report and stores it in an artifact.
*   The uploaded artifact's contents are added to the GitHub Actions step summary.

## Dependencies
| Dependency | Why |
| --- | --- |
| actions/checkout@v4 | Provides the necessary steps for checking out the repository code. |
| actions/setup-node@v3 | Allows setting up a Node.js environment with version 18. |

## Side Effects

## Dependents
No known dependents.

## Cross-References
No cross-references.


## Symbol Dependencies

*No internal function calls detected.*

*No downstream callers detected.*
