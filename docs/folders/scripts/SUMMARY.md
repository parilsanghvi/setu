---
source_hash: 0b30d4386b70d0f1
facts_hash: 0b30d4386b70d0f1
generated_at: 2026-03-04T10:14:47.312Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: scripts

## Purpose
This scripts folder contains essential tools and test scripts for various applications and workflows within the repository, including link validation, drift detection, ignition of systems, swarming, and testing of internal models.

## Key Files
| File | Role |
| check-doc-links.js | Validates internal Markdown links in documentation files |
| drift-step-summary.js | Generates a summary report of drifts in system documentation |
| ignite.js | Launches the Setu mission control system, including frontend and backend components |
| init_swarm.js | Initializes swarm agents with an offline status in the database |
| onboarding-status.js | Checks the onboarding status of a system, generating log entries as needed |
| test-google-internal.js | Tests interaction with Google OAuth provider for content generation |
| test-model-list-internal.js | Verifies availability of internal models via Cloud Storage API |
| test-model-list-refined.js | Tests listing profiles and models using AuthStore and Cloud Code API |
| test-model-list.js | Lists models via generativelanguage API to verify functionality |
| test-universal-llm.js | Generates responses using Universal LLM model, logging results to console |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All scripts follow the standard naming convention (lowercase with underscores) and use descriptive variable names.
Likely: Error messages are thrown with clear explanations of what went wrong, making debugging easier.

## Cross-References
- [check-doc-links.js](../../files/scripts/check-doc-links.js.md)
- [drift-step-summary.js](../../files/scripts/drift-step-summary.js.md)
- [ignite.js](../../files/scripts/ignite.js.md)
- [init_swarm.js](../../files/scripts/init_swarm.js.md)
- [onboarding-status.js](../../files/scripts/onboarding-status.js.md)
- [test-google-internal.js](../../files/scripts/test-google-internal.js.md)
- [test-model-list-internal.js](../../files/scripts/test-model-list-internal.js.md)
- [test-model-list-refined.js](../../files/scripts/test-model-list-refined.js.md)
- [test-model-list.js](../../files/scripts/test-model-list.js.md)
- [test-universal-llm.js](../../files/scripts/test-universal-llm.js.md)

