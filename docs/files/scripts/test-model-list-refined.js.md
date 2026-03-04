---
source_hash: 6e6cdbc10531933b
facts_hash: c2922337e216a25b
generated_at: 2026-03-04T05:49:25.636Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-model-list-refined.js

## Purpose
This file tests the `listProfiles` method of the `AuthStore` class to retrieve a Google profile ID, then uses this ID to fetch available models with an empty body and Antigravity headers from the Cloud Code API.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Handles the main execution flow of the test. |

## Internal Logic
The main execution flow involves:
- Calling `listProfiles` on `AuthStore` to retrieve a Google profile ID.
- If no Google profile ID is found, the program exits.
- Using `GoogleAuth` to obtain a valid token for the Google profile ID.
- Fetching available models with an empty body and Antigravity headers using the Cloud Code API's `fetchAvailableModels` endpoint.
- Handling the response from the API, logging success or failure messages depending on the status code.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `AuthStore` | Yes | Manages authentication-related functionality. |
| `GoogleAuth` | Yes | Handles Google-specific authentication and token retrieval. |

## Side Effects
- console_output: The program logs messages to the console, including success or failure messages and API response details.
- network: The program makes a network request to the Cloud Code API's `fetchAvailableModels` endpoint to retrieve available models.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
