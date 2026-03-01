---
source_hash: a63532e411ffa93c
facts_hash: 6a7404fa20ce3666
generated_at: 2026-02-25T12:05:45.343Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/auth/profile-mgr.js

## Purpose
The ProfileManager class manages authentication profiles, resolving API keys from environment variables and the AuthStore, and providing methods for explicit profile retrieval and list generation.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `resolveApiKey` | function | Resolves API key with precedence using environment variables and AuthStore profiles. |
| `getProfile` | function | Explicitly retrieves a specific authentication profile by ID. |
| `listProfiles` | function | Returns a list of all available authentication profiles. |

## Internal Logic
The ProfileManager class has the following key functions:
- The constructor initializes the envMap object with API key mappings.
- The resolveApiKey method checks for environment variable overrides and then retrieves the most recently updated profile from the AuthStore, prioritizing OAuth access tokens over API keys.
- The getProfile method directly queries the AuthStore for a specific profile by ID.
- The listProfiles method fetches all profiles from the AuthStore.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `AuthStore` | Yes | Provides storage and retrieval of authentication profiles. |

## Side Effects
- env_access: The resolveApiKey function checks for environment variable overrides, which can expose sensitive API keys to unauthorized access if not properly secured.
- auth_store_retrieval: The resolveApiKey and getProfile functions query the AuthStore, potentially impacting performance or database load when large numbers of profiles are queried.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](./auth-store.js.md)
