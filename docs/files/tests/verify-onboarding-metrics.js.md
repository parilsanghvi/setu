---
source_hash: b3867e7d47dafe30
facts_hash: 7d0a4a5d7d51eee3
generated_at: 2026-03-04T06:13:38.918Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/verify-onboarding-metrics.js

## Purpose
This file contains a test suite for the onboarding metrics verification system, specifically testing the `getOnboardingStatus` function's ability to detect missing and valid documentation.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| getOnboardingStatus | function | `` | Returns the onboarding status of a given file. |
| assert | global | `` | Provides assertion functions for testing. |

## Internal Logic
The test suite runs in an async manner, starting with an initial check of the onboarding status before performing various operations to test its enforcement.

Key functions include:

- `runTest`: The main test function that orchestrates the entire test process.
- `getOnboardingStatus`: Retrieves and returns the onboarding status for a given file.

The execution flow involves:

1. Initial state check
2. Adding an undocumented file
3. Adding valid documentation
4. Adding placeholder documentation
5. Adding short documentation

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Provides assertions for testing |
| fs | No | Provides file system operations utilities |
| path | No | Provides file system paths utilities |

## Side Effects
- console_output: The test suite logs various messages to the console, including success and failure indicators.
- filesystem_read: The test suite reads files from disk using `fs.writeFileSync` and checks their existence before writing.
- filesystem_write: The test suite writes files to disk using `fs.writeFileSync`, adding new content or deleting existing files.
- process_control: The test suite exits the process with a non-zero status code if the tests fail, or continues running with success.

## Dependents
No known dependents.

## Cross-References
- [status.js](../lib/onboarding/status.js.md)
