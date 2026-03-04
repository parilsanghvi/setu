---
source_hash: 341528a91786b993
facts_hash: dfb7acd098f093cb
generated_at: 2026-03-04T05:51:24.866Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/list-models.js

## Purpose
This file, tests/list-models.js, is a test script that demonstrates how to fetch available models for the argon-stock-s9hpx device using the Google authentication provider. It uses the AuthStore and GoogleAuth classes from other modules to authenticate with Google and retrieve the list of available models. The test logs various messages to the console to track its progress.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `googleProfiles` | array |  | Returns an array of profile objects from the AuthStore |
| `GoogleAuth.getValidToken` | function | `profile.id` | Returns a valid token for authentication with Google |
| `GoogleProvider.fetchModels` | function | `token` | Fetches available models using the provided token |

## Internal Logic
The test script starts by finding the list of profiles from the AuthStore, then filters for the argon-stock-s9hpx project if possible. It prefers the profile from the argon-stock-s9hpx project if one is found. The test then logs messages to track its progress and authenticates with Google using the `GoogleAuth.getValidToken` method. Finally, it fetches the list of available models using the `GoogleProvider.fetchModels` method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | Provides a store for authentication data |
| `../lib/auth/google` | Yes | Provides classes and utilities for Google authentication |
| `../lib/Config` | Yes | Provides configuration settings for the test script |
| `../lib/models/providers/google` | Yes | Provides a class for fetching models using the Google provider |

## Side Effects
- console_output: The script logs various messages to the console, including progress updates and error messages.
- process_control: If no profile is found in the AuthStore, the script exits with an error code.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
- [Config.js](../lib/Config.js.md)
- [google.js](../lib/models/providers/google.js.md)
