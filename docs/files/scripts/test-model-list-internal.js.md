---
source_hash: 340e458e23f9d379
facts_hash: fb2eded5cbdb8fc4
generated_at: 2026-02-25T12:15:06.334Z
generator_version: 1.0.0
model: cheap
quality_score: 70
---
# File: scripts/test-model-list-internal.js

## Purpose
This file contains a script that lists available models for the Google Cloud Code using the `GoogleAuth` and `AuthStore` classes, which manage authentication and profile information.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Lists available models via v1internal:fetchAvailableModels |

## Internal Logic
The main execution flow involves the following key steps:
- The script attempts to retrieve a list of profiles using `AuthStore.listProfiles()`.
- It then filters out any non-Google profile IDs.
- The script uses `GoogleAuth.getValidToken()` to obtain a valid token for the authenticated user and retrieves the project ID with `GoogleAuth._fetchProjectId(token)`.
- It makes an HTTP POST request to `v1internal:fetchAvailableModels` using the obtained token and project ID.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides functions for authentication with Google Cloud Code.
| `../lib/auth/auth-store` | Yes | Manages authentication profile information.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
