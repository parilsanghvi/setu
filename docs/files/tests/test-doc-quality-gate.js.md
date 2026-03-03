---
source_hash: cc0f673cb331be7d
facts_hash: 639925dbd8795793
generated_at: 2026-03-03T07:39:58.301Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-doc-quality-gate.js

## Purpose
This file contains unit tests for the S-Tier Documentation System, specifically testing the functionality of the `isDocPopulated()`, `scoreDocQuality()`, `extractSymbols()`, `extractExports()`, `extractSideEffects()`, and `redactSecrets()` functions.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| example | function | Handles incoming requests and returns a response |
| extra | cjs_prop | Exports a value for use in other modules |
| hello | cjs_named | Returns the name of a function or class export |
| world | cjs_named | Returns the name of another function or class export |

## Internal Logic
The main execution flow involves creating temporary files, running tests on these files, and comparing expected results to actual outputs. The key functions include `createTempFile()`, `cleanup()`, `assert()`, and various test suites for each of the mentioned functions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| example | Yes | Provides helper utilities |
| lib/onboarding/doc-enricher | Yes | Enhances documentation metadata |
| lib/onboarding/doc-facts | Yes | Extracts facts from code |
| lib/onboarding/status | Yes | Reports status of documentation tests |

## Side Effects
- console_output: Tests output to the console, comparing expected and actual results.
- database: None detected.
- env_access: None detected.
- filesystem_read: Tests reading files into memory for analysis.
- filesystem_write: Tests writing files to disk for persistence.
- network: None detected.
- process_control: None detected.

## Dependents
No known dependents.

## Cross-References
- [doc-enricher.js](../lib/onboarding/doc-enricher.js.md)
- [doc-facts.js](../lib/onboarding/doc-facts.js.md)
- [status.js](../lib/onboarding/status.js.md)
