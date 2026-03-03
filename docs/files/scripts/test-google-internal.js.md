---
source_hash: c764a12cc2198c55
facts_hash: 5b1604b8fc66850b
generated_at: 2026-03-03T07:29:49.396Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-google-internal.js

## Purpose
This file runs a test suite for the Gemini 2.0 flash thinking experiment model, using Google OAuth authentication to generate content. It tests various scenarios with different user prompts and generates results using the cloudcode-pa API. The test suite is designed to ensure the correctness of the experimental setup.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | Runs the test suite |
| `for` | method | `const v of variations` | Loops through different model and project combinations |
| `if` | method | `!profileKey` | Checks if a Google OAuth profile is found in auth.json |

## Internal Logic
The main execution flow starts with loading authentication data from `.setu/auth.json`. It then finds a Google OAuth profile, loads cached OAuth credentials from `.gemini/oauth_creds.json`, and deletes unnecessary project ID information. The test suite then iterates through different model and project combinations using the `for` loop.

Key functions include:

* `main`: Runs the test suite.
* `fs.readFileSync`: Reads authentication data from file.
* `JSON.parse`: Parses JSON data from file.
* `execSync`: Executes a curl command to generate content on the cloudcode-pa API.
* `crypto.randomUUID`: Generates a unique user prompt ID.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities for reading authentication data |
| `os` | No | Provides operating system utilities, such as homedir() |
| `path` | No | Provides path manipulation utilities, such as joining paths |
| `child_process` | Yes | Provides subprocess execution utilities using execSync |
| `crypto` | Yes | Provides cryptographic utilities, including randomUUID generation |

## Side Effects
- console_output: The test suite prints console logs and errors to the standard output.
- filesystem_read: The test suite reads authentication data from `.setu/auth.json` and cached OAuth credentials from `.gemini/oauth_creds.json`.
- subprocess: The test suite executes a curl command using `execSync` to generate content on the cloudcode-pa API.

## Dependents
No known dependents.

## Cross-References
- [google.js](../lib/models/providers/google.js.md)
