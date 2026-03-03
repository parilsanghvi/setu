---
source_hash: a63532e411ffa93c
facts_hash: e49c0bae0fe01fe4
generated_at: 2026-03-03T07:18:19.451Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/auth/profile-mgr.js

## Purpose
The ProfileManager class is responsible for managing user profiles, resolving API keys based on environment variables and Auth Store profiles, and providing methods to retrieve specific profiles. It handles the complexity of authenticating users with multiple APIs by encapsulating the logic in a single class.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| profileManager | cjs_default | Exports an instance of the ProfileManager class |
| resolveApiKey | function | Resolves API key for a given provider and options |
| getProfile | function | Retrieves a specific user profile by ID |
| listProfiles | function | Lists all available user profiles |

## Internal Logic
The main execution flow involves the following steps:

* The constructor initializes the environment map with predefined API keys.
* The `resolveApiKey` method checks environment variables for an explicit override, then queries the Auth Store to find a matching profile. If found, it returns the resolved API key.
* The `getProfile` and `listProfiles` methods delegate their work to the Auth Store, allowing external access to user profiles.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| AuthStore | Yes | Provides a centralized store for user profiles |
| './auth-store' | Yes | Supplies necessary dependencies for authenticating users |

## Side Effects
- env_access: The resolveApiKey method retrieves environment variables, which may expose sensitive information to the application.
- env_update: Setting an environment variable through the resolveApiKey method updates the corresponding value in the environment map.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](./auth-store.js.md)
