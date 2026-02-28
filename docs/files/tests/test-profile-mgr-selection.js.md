---
source_hash: 84bb5261b248b2e0
facts_hash: 89f4e082dcbf2861
generated_at: 2026-02-25T12:28:14.892Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-profile-mgr-selection.js

## Purpose
This file contains unit tests for the ProfileManager class, specifically testing its selection logic for resolving an API key from a profile manager.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `createProfile` | arrow | `id, updatedAt` | Creates a test profile with the given id and updatedAt timestamp. |
| `AuthStore.findProfilesByProvider` | method | `provider` | Returns a list of profiles for the specified provider. |

## Internal Logic
The main execution flow involves setting up mock data, modifying the AuthStore to return specific profiles for testing, and then calling the ProfileManager's resolveApiKey function with different options.

Key functions include:
- `createProfile`: Creates a test profile with the given id and updatedAt timestamp.
- `AuthStore.findProfilesByProvider`: Returns a list of profiles for the specified provider.
- `ProfileManager.resolveApiKey`: Resolves an API key from a profile manager, taking into account selection logic.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `createProfile` | Yes | 
| `../lib/auth/auth-store` | No | Provides the AuthStore instance for testing. |
| `../lib/auth/profile-mgr` | Yes | Implements the ProfileManager class being tested. |
| `assert` | Yes | Used for assertions in the tests. |

## Side Effects
- console_output: The test file logs various results and error messages to the console.
- process_control: If a test fails, the process exits with an error code of 1.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [profile-mgr.js](../lib/auth/profile-mgr.js.md)
