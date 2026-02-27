---
source_hash: 5d37e9bd39501cf3
facts_hash: beb4480e776cc3f1
generated_at: 2026-02-25T12:12:53.949Z
generator_version: 1.0.0
model: cheap
quality_score: 71
---
# File: lib/utils/JsonParser.js

## Purpose
This file defines a utility class `JsonParser` that parses JSON from potentially messy Large Language Model (LLM) outputs, handling common formatting issues using multiple strategies.

## Exports / API Surface
| Export | Type | Description |
| JsonParser | cjs_default | Provides the `parse` function to parse JSON from LLM outputs. |

## Internal Logic
The main execution flow of the `JsonParser` class involves attempting to parse a given text string as JSON using three strategies: direct parsing, Markdown code block extraction, and substring extraction.

- `static parse(text)`: Attempts to parse the input text as JSON directly.
- Markdown block regex matching: Extracts any matched content within Markdown code blocks (```json```, ```JSON```, or ```) and attempts to parse it as JSON.
- Substring extraction: Searches for the first `{` and last `}` characters in the input string, extracting a potential JSON substring and attempting to parse it.

## Dependencies
| Why | Description |
| No imports detected. | The class relies solely on built-in JavaScript functionality for its parsing logic.

## Dependents
No known dependents.

## Cross-References
No cross-references.
