---
source_hash: 574387e436182889
facts_hash: 827acb7d7d2f0f7a
generated_at: 2026-02-25T12:19:13.312Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-base-provider.js

## Purpose
This file contains tests for the `BaseProvider` class, specifically testing its veto and risk trigger functionality, as well as its default JSON response.

| Symbol | Type | Params |
|--------|------|--------|
| `vetoPhrases` | array | `[ 'Evaluate this architectural spec', 'Evaluate this UI/Frontend spec', 'Evaluate this Database/Schema spec' ]` |
| `riskyPhrase` | string | `"Review this junior engineer's plan"` |
| `defaultPhrase` | string | `"Hello world"` |

## Internal Logic
The main execution flow of this file is to create an instance of the `BaseProvider` class and test its methods. The key functions are:
- `getMockResponse`: generates a mock response based on the input phrase.
- `testVetoPhrases`: tests the veto trigger functionality by iterating over the `vetoPhrases` array.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | Yes | Provides assertion utilities for testing. |

## Side Effects
- console_output: The file logs success or failure messages to the console using `console.log` and `console.error`.
- process_control: If an error occurs during testing, the file exits with a non-zero status code using `process.exit(1)`.

## Dependents
No known dependents.

## Cross-References
- [BaseProvider.js](../lib/llm/BaseProvider.js.md)
