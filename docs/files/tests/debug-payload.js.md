---
source_hash: 4b6d2d68b60f1f8f
facts_hash: 39f5bca5677362fd
generated_at: 2026-03-04T05:51:00.129Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/debug-payload.js

## Purpose
This file tests the debug payload functionality of the Google authentication system, specifically generating content using the antigravity API.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `GoogleAuth` | function | `profile.id` | Retrieves a valid token for a given profile ID. |
| `AuthStore` | function | `provider: 'google'` | Finds profiles by provider. |
| `fetch` | method | `url, options` | Sends an HTTP request to the specified URL with the provided options. |

## Internal Logic
The main execution flow involves:
- Getting a valid token for a specific profile using `GoogleAuth.getValidToken(profile.id)`.
- Defining variations of payload requests for testing different cases.
- Iterating over each variation, constructing and sending an HTTP request to generate content using `fetch`, and logging the response.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides functionality for interacting with Google authentication. |
| `../lib/auth/auth-store` | Yes | Retrieves profiles from storage for testing. |
| `crypto` | No | Generates random user prompt IDs and session IDs for payload requests. |

## Side Effects
- console_output: The file logs various messages to the console, including test results, errors, and debug information.
- network: The file sends HTTP requests to generate content using the antigravity API, which may result in network connections being established or updated.
- process_control: The file exits the process with a non-zero status code if no valid profile is found.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
