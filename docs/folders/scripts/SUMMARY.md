---
source_hash: 8abcd3342f853a3d
facts_hash: 8abcd3342f853a3d
generated_at: 2026-02-25T12:38:26.308Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: scripts

## Purpose
This folder contains scripts for various tasks such as validating documentation links, generating drift detection reports, igniting the system, initializing swarm agents, and testing different components of the Setu system.

## Key Files
| File | Role |
| check-doc-links.js | Validates internal markdown links in the repository. |
| drift-step-summary.js | Generates a summary report of drift detection results in Drift projects. |
| ignite.js | Orchestrates the startup process of the Setu system, launching the setup wizard and sending activation signals to the kernel. |
| init_swarm.js | Initializes swarm agents by upserting them into the database and ensuring they are initially marked as offline. |
| onboarding-status.js | Fetches and logs the onboarding status, maintaining a history of previous events. |
| test-google-internal.js | Tests the functionality of the Gemini AI model using the Google OAuth provider. |
| test-model-list-internal.js | Lists available models for the Google Cloud Code using authentication management classes. |
| test-model-list-refined.js | Tests the model listing functionality of the CloudCode API using authentication tokens. |
| test-model-list.js | Tests the Generative Language API model listing via authentication tokens obtained from Google Auth. |
| test-universal-llm.js | Tests the Universal LLM's response generation capabilities. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The scripts in this folder should run on a consistent schedule to maintain data consistency across different components.
| Rule | Description | Reason |
| Code Review | Scripts should undergo regular review to ensure they are functioning as intended and follow best practices. | To prevent bugs and improve overall code quality. |

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

