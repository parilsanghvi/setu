---
source_hash: 340e458e23f9d379
facts_hash: 5fe306e7205a2489
generated_at: 2026-03-04T05:49:16.234Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-model-list-internal.js

## Purpose
This file tests the internal models list functionality for Google Cloud Storage using the `GoogleAuth` and `AuthStore` classes, verifying that it can fetch available models via the v1internal:fetchAvailableModels endpoint.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `googleProfileId` | arrow | `profiles.find(p => p.startsWith('google-'))` | Finds a Google profile ID from the list of profiles. |
| `main` | function | `` | Runs the main test execution flow. |

## Internal Logic
The file executes the following key functions:
- `AuthStore.listProfiles()`: Retrieves a list of user profiles.
- `GoogleAuth.getValidToken(googleProfileId)`: Obtains a valid access token for the specified Google profile ID.
- `GoogleAuth._fetchProjectId(token)`: Fetches the project ID associated with the obtained access token.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides authentication functionality. |
| `../lib/auth/auth-store` | Yes | Manages user profile data and authorization state. |

## Side Effects
- console_output: The function logs various messages to the console, including success or failure indicators, Google profile IDs, project IDs, and available model IDs.
- network: The function makes a POST request to the v1internal:fetchAvailableModels endpoint on the Cloud Storage server, establishing a network connection.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
