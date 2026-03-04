---
source_hash: 84bb5261b248b2e0
facts_hash: 883424e7182737a7
generated_at: 2026-03-04T06:05:52.763Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-profile-mgr-selection.js

## Purpose
This file contains test cases for the ProfileManager class, specifically its selection logic. The tests verify that the default selection behavior returns the most recently updated profile and that specific profiles can be requested by providing an options object.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `createProfile` | arrow | `id, updatedAt` | Creates a test profile with given id and updatedAt timestamp. |
| `AuthStore.findProfilesByProvider` | method | `provider` | Returns a list of profiles for the specified provider. |

## Internal Logic
The main execution flow involves creating mock data, setting up an AuthStore mock to return a fixed list of profiles, and then calling the ProfileManager's resolveApiKey method with different options.

Key functions:

*   `createProfile`: Creates a new test profile object.
*   `AuthStore.findProfilesByProvider` (mocked): Returns a pre-defined list of profiles for the 'test-provider'.
*   `ProfileManager.resolveApiKey`: Resolves an API key and returns the corresponding profile based on selection logic.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | Provides the AuthStore instance used by ProfileManager. |
| `../lib/auth/profile-mgr` | Yes | Makes the ProfileManager class available for testing. |
| `assert` | No | Offers assertion utilities for testing. |

## Side Effects
-   console_output: The test cases log messages to the console indicating the results of each test, including success or failure messages and profile selections.
-   process_control: If a test fails, the process exits with an error code (1).

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [profile-mgr.js](../lib/auth/profile-mgr.js.md)
