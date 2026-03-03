---
source_hash: 340e458e23f9d379
facts_hash: 0f5c13d28cfebea9
generated_at: 2026-03-03T07:29:58.852Z
generator_version: 1.0.0
model: cheap
quality_score: 75
---
# File: scripts/test-model-list-internal.js

## Purpose
This file is used to test the internal Google Cloud API v1internal:fetchAvailableModels endpoint by authenticating with a valid token and fetching available models for a given project ID.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Handles main execution flow of testing internal Google Cloud API. |

## Internal Logic
The main execution flow involves the following key functions:
- `AuthStore.listProfiles()`: Retrieves a list of all profiles stored in the auth store.
- `GoogleAuth.getValidToken(profileId)`: Authenticates with the given profile ID to obtain a valid token.
- `GoogleAuth._fetchProjectId(token)`: Fetches the project ID associated with the obtained token.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides Google authentication utilities. |
| `../lib/auth/auth-store` | Yes | 

## Side Effects
- console_output: The script logs various messages to the console, including success or failure indicators, console output from API requests, and debug information.
- network: The script makes a POST request to the internal Google Cloud API v1internal:fetchAvailableModels endpoint using a valid token, which may result in network activity.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
