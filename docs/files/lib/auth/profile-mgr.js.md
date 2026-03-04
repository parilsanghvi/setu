---
source_hash: a63532e411ffa93c
facts_hash: c4d2c58b91672cc9
generated_at: 2026-03-04T05:38:04.259Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/auth/profile-mgr.js

## Purpose
The `ProfileManager` class is responsible for managing API keys, profiles, and their relationships, serving as a centralized authority for authentication-related data. It provides methods to resolve API keys, retrieve specific profiles, and list all available profiles. This module exports an instance of the `ProfileManager` class.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `resolveApiKey` | function | Resolves an API key with precedence based on environment variables and Auth Store profiles |
| `getProfile` | function | Retrieves a specific profile by ID |
| `listProfiles` | function | Lists all available profiles |
| `new` | cjs_default | Exports a new instance of the ProfileManager class |

## Internal Logic
The main execution flow of the `ProfileManager` class involves resolving API keys using the `resolveApiKey` method, which checks environment variables and Auth Store profiles for precedence. The `getProfile` method directly retrieves a profile by ID from the Auth Store, while the `listProfiles` method fetches all available profiles from the Auth Store.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./auth-store` | Yes | Provides the implementation of profiles and their data |

## Side Effects
- env_access: The `resolveApiKey` method accesses environment variables to determine API key precedence.
- auth_store_update: The `resolveApiKey` method updates the Auth Store with new profile data when resolving an API key from a stored profile.
- env_var_change: The `getProfile` and `listProfiles` methods do not have explicit side effects, but they rely on the environment variables being set correctly.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](./auth-store.js.md)
