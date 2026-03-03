---
source_hash: d145195b3569e2c1
facts_hash: 900e3b90738e538c
generated_at: 2026-03-03T07:30:18.405Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: scripts/test-model-list.js

## Purpose
This file executes the `main` function, which retrieves a valid token from Google Authentication and uses it to list models via the Generative Language API.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| main | function | `` | Handles authentication with Google Auth. |

## Internal Logic
The execution flow starts by calling `AuthStore.listProfiles()` to retrieve a list of profiles, including the Google profile ID if present. The `main` function then attempts to get a valid token using the Google Auth `getValidToken` method for the specified profile ID. If successful, it logs a success message and fetches models from the Generative Language API using an authenticated request.

| Key Function | Description |
|---------------|-------------|
| `listProfiles` | Retrieves a list of profiles from the auth-store. |
| `getValidToken` | Retrieves a valid token for the specified Google profile ID. |

## Dependencies
The file relies on the following modules:
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides the functionality to authenticate with Google Auth. |
| `../lib/auth/auth-store` | Yes | Stores and manages user authentication data, including profiles. |

## Side Effects
- console_output: Logs success and error messages to the console.
- network: Performs a network request to the Generative Language API to retrieve models.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
