---
source_hash: 6e6cdbc10531933b
facts_hash: fa57d3d733c39e63
generated_at: 2026-02-25T12:15:13.956Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: scripts/test-model-list-refined.js

## Purpose
This file tests the model listing functionality of the CloudCode API, using the GoogleAuth and AuthStore classes to authenticate and retrieve available models.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Handles the main execution flow of the test. |

## Internal Logic
The `main` function is executed when the script starts. It:
- Retrieves a Google profile ID from the AuthStore.
- Authenticates using the GoogleAuth class to retrieve a valid token.
- Uses this token to make a POST request to the CloudCode API with an empty body and Antigravity headers.
- Checks if the response is successful (200 OK) and logs the received data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides a class for authenticating with Google. |
| `../lib/auth/auth-store` | Yes | Stores authentication-related data, including user profiles. |

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
