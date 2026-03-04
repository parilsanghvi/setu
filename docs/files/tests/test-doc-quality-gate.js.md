---
source_hash: cc0f673cb331be7d
facts_hash: 1c4d6689ff84b66c
generated_at: 2026-03-04T06:00:14.622Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-doc-quality-gate.js

## Purpose
This file contains unit tests for the S-Tier Documentation System, specifically testing the `isDocPopulated()` function, `scoreDocQuality()` function, and various helper functions such as `extractSymbols()`, `extractExports()`, `extractSideEffects()`, `redactSecrets()`, `parseFrontmatter()`, and `isPlaceholderDoc()`.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `extra` | cjs_prop | Exports an additional property to be used by the application. |
| `hello` | cjs_named | Returns the value of the 'hello' named export. |
| `world` | cjs_named | Returns the value of the 'world' named export. |

## Internal Logic
The main execution flow of this file is as follows:
1. The test suite creates temporary files with different contents using the `createTempFile()` function.
2. Each file is then passed through the various functions being tested, such as `isDocPopulated()`, `scoreDocQuality()`, `extractSymbols()`, etc.
3. The results of each function are compared to expected values and asserted using the `assert()` function.
4. If all tests pass, the total number of passed and failed tests is printed, and the process exits with a status code of 0.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/doc-enricher` | Yes | Contains functions to enrich documentation, such as redacting secrets and parsing frontmatter. |
| `../lib/onboarding/doc-facts` | Yes | Provides functions to extract facts from code, such as symbols, exports, and side effects. |
| `../lib/onboarding/status` | Yes | Contains functions related to the onboarding status of a documentation set. |
| `fs` | No | Not used directly in this file, but required for creating temporary files. |
| `os` | No | Not used directly in this file. |
| `path` | No | Not used directly in this file. |

## Side Effects
- console_output: The test suite prints various messages to the console during execution.
- database: The functions being tested do not modify a database, but the `scoreDocQuality()` function may write temporary data files.
- env_access: None of the functions being tested access environment variables directly.
- filesystem_read: The functions being tested read temporary files created in the test directory.
- filesystem_write: The functions being tested write to temporary files in the test directory.
- network: None of the functions being tested make network calls.
- process_control: None of the functions being tested modify process control settings.

## Dependents
No known dependents.

## Cross-References
- [doc-enricher.js](../lib/onboarding/doc-enricher.js.md)
- [doc-facts.js](../lib/onboarding/doc-facts.js.md)
- [status.js](../lib/onboarding/status.js.md)
