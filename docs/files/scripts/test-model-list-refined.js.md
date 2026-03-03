---
source_hash: 6e6cdbc10531933b
facts_hash: 5711140c3bb75d2b
generated_at: 2026-03-03T07:30:08.949Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-model-list-refined.js

## Purpose
This file, `test-model-list-refined.js`, tests the functionality of listing available models using the Antigravity API. The `main` function sends a request to fetch available models with an empty body and specific headers to verify its correctness. Additionally, it retrieves user profiles from the AuthStore to obtain a valid Google authentication token.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Handles testing of Antigravity API model listing functionality. |

## Internal Logic
The main execution flow in this file involves the following key functions:
- `AuthStore.listProfiles()`: Retrieves a list of user profiles from the AuthStore.
- `GoogleAuth.getValidToken(googleProfileId)`: Obtains a valid authentication token using the provided Google profile ID.
- The code sends an HTTP request to fetch available models with specific headers and an empty body.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides functionality for obtaining authentication tokens from Google. |
| `../lib/auth/auth-store` | Yes | Manages user profiles and provides a list of profiles to authenticate with the Antigravity API. |

## Side Effects
- console_output: This file logs various messages to the console, including successful or failed requests, response status codes, and error messages.
- network: The code sends an HTTP request to the Antigravity API, potentially impacting network connectivity and performance if multiple concurrent requests are made.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
