---
source_hash: d145195b3569e2c1
facts_hash: 422c3ac44518d64e
generated_at: 2026-03-04T05:49:35.160Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: scripts/test-model-list.js

## Purpose
This file executes a test that lists models via the generativelanguage API using an AuthStore to retrieve the user's profiles and GoogleAuth to obtain a valid token.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Lists models via generativelanguage API |

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `GoogleAuth` | module | `google-<profileId>` | Provides a GoogleAuth instance for the specified profile ID |
| `AuthStore` | module | `` | Manages user authentication data |

## Internal Logic
The main execution flow involves:
- Retrieving the list of profiles using AuthStore.listProfiles()
- Finding the Google profile ID and attempting to get a valid token using GoogleAuth.getValidToken(googleProfileId)
- Making a request to the generativelanguage API with the obtained token to retrieve the list of models

Key functions:
- `fetch`: Sends an HTTP request to the specified URL
- `res.ok` and `res.json`: Check if the response is OK and parse the JSON data, respectively

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Manages Google authentication for user profiles |
| `../lib/auth/auth-store` | Yes | Stores and retrieves user authentication data |

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
