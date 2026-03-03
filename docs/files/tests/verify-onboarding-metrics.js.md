---
source_hash: b3867e7d47dafe30
facts_hash: 5d1660d4caf976d8
generated_at: 2026-03-03T07:54:21.245Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/verify-onboarding-metrics.js

## Purpose
This file contains a test suite for verifying the enforceability of onboarding metrics in a project. The `runTest` function simulates various scenarios, such as adding and removing undocumented files, to ensure that the system correctly detects missing documentation and updates its completeness score accordingly.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| getOnboardingStatus | function | `` | Returns the current onboarding status of the project. |
| runTest | function | `` | Runs a test suite for verifying onboarding metrics enforceability. |

## Internal Logic
The `runTest` function is an asynchronous function that simulates various scenarios to verify the behavior of the `getOnboardingStatus` function. The main execution flow is as follows:

1. It calls `getOnboardingStatus` to retrieve the initial onboarding status.
2. If the initial status is not 100% green, it proceeds with the test.
3. It adds an undocumented file and verifies that the system correctly detects its missing documentation.
4. It adds valid documentation and verifies that the system updates its completeness score accordingly.
5. It adds placeholder documentation and verifies that the system correctly rejects it.
6. It adds short documentation and verifies that the system correctly rejects it.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides file system utilities. |
| path | No | Provides path manipulation utilities. |
| assert | No | Provides assertion utilities. |
| ../lib/onboarding/status | Yes | Implements the onboarding status logic. |

## Side Effects
- console_output: The function prints various messages to the console, including test outcomes and error messages.
- filesystem_read: The function reads files from disk using `fs.readFileSync` or `fs.writeFileSync`.
- filesystem_write: The function writes files to disk using `fs.writeFileSync`.
- process_control: The function uses `process.exit(1)` to exit the process with a non-zero status code if the test fails.

## Dependents
No known dependents.

## Cross-References
- [status.js](../lib/onboarding/status.js.md)
