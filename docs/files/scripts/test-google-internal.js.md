---
source_hash: c764a12cc2198c55
facts_hash: 1600605dbd64f45f
generated_at: 2026-02-25T12:14:57.951Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: scripts/test-google-internal.js

## Purpose
This file, `test-google-internal.js`, contains a script that tests the functionality of the Gemini AI model using the Google OAuth provider. It authenticates with the user's Google account and uses the obtained credentials to generate content on the Gemini platform. The script runs through various test cases to ensure the correct behavior.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Starts the test process |
| `for` | method | `const v of variations` | Iterates over test cases |
| `if` | method | `!profileKey` | Checks for the presence of a Google OAuth profile |

## Internal Logic
The main execution flow involves:

1. **main function**: The entry point of the script, which starts the test process by authenticating with the user's Google account and obtaining the necessary credentials.
2. **Finding Google OAuth profile**: The script searches for a Google OAuth profile in the authentication data (`auth.json`) file. If no such profile is found, it prints an error message and exits.
3. **Deleting project ID**: To force discovery of the model, the script deletes the `projectId` from the obtained profile.
4. **Iterating over test cases**: The script runs through a list of predefined test cases (`variations`) for each model variant. In each iteration:
	* It creates a payload with the necessary parameters (model, project, user prompt ID, request).
	* It uses an exact User-Agent header to match the one used in the CLI.
	* It sends a POST request to generate content on the Gemini platform using the obtained credentials and the payload.
	* It prints the result of the request if it succeeds.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/models/providers/google` | Yes | Implements the Google OAuth provider logic. |
| `child_process` | No | Provides utilities for running external processes (in this case, `curl`). |

## Side Effects
- console_output: The script prints various messages to the console, including success or error messages, test results, and warnings.
- filesystem_read: The script reads data from files on the local file system, such as authentication data (`auth.json`) and OAuth credentials (`oauth_creds.json`).
- subprocess: The script runs an external process (using `execSync`) to send a POST request to generate content on the Gemini platform.

## Dependents
No known dependents.

## Cross-References
- [google.js](../lib/models/providers/google.js.md)
