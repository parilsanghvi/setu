---
source_hash: 89075a8bfd892a5e
facts_hash: 89075a8bfd892a5e
generated_at: 2026-03-03T08:00:29.333Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: scripts

## Purpose
This scripts folder contains a collection of utility and testing files for various applications, including documentation validation, swarm agent initialization, onboarding status reporting, and internal Google Cloud API testing.

## Key Files
| File | Role |
| check-doc-links.js | Validates internal markdown links in documentation files and reports broken links. |
| drift-step-summary.js | Generates a Markdown report summarizing the results of a docs drift check, including suggested reviewers and ownership information. |
| ignite.js | Launches the frontend and backend systems, sends an activation signal to initiate the audit process, and handles configuration checks and system shutdown on exit. |
| init_swarm.js | Initializes swarm agents by seeding their data into the database using the Bus heartbeat method. |
| onboarding-status.js | Generates an onboarding status report and writes it to a log file, handling errors silently in CI/GitHub Actions environments. |
| test-google-internal.js | Tests various scenarios with different user prompts and generates results using the cloudcode-pa API for the Gemini 2.0 flash thinking experiment model. |
| test-model-list-internal.js | Authenticates with a valid token and fetches available models for a given project ID using the Antigravity API v1internal:fetchAvailableModels endpoint. |
| test-model-list-refined.js | Verifies the functionality of listing available models using the Generative Language API, including retrieving user profiles from AuthStore. |
| test-model-list.js | Handles authentication with Google Auth and lists models via the Generative Language API. |
| test-universal-llm.js | Exercises the LLM's generate method using both an expensive and a cheap model. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All files in this folder follow the standard coding conventions for JavaScript, including consistent naming conventions, indentation, and commenting.
Likely: The `init_swarm.js` file ensures that all swarm agents are initialized with the same data to maintain consistency across the system.

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

