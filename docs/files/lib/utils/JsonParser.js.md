---
source_hash: 5d37e9bd39501cf3
facts_hash: 629d8e6d31395ea1
generated_at: 2026-03-04T05:46:32.278Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/utils/JsonParser.js

## Purpose
The JsonParser class is a utility for parsing JSON from potentially messy LLM outputs, handling common formatting issues using three strategies: direct JSON parse, Markdown code block extraction, and substring extraction.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `JsonParser` | cjs_default | Exports the JsonParser class for use by other modules. |

## Internal Logic
The main execution flow of the JsonParser class involves three attempts to parse the input text as JSON: direct parsing, Markdown block extraction, and substring extraction. The key functions include:
- `parse(text)`: Attempts to parse a string as JSON, handling common LLM formatting issues using three strategies.
  - This function takes a string `text` as input and returns an object or null if the parsing fails.

## Dependencies
| Export | Type | Why |
|--------|------|-----|
| `JsonParser` | cjs_default | Implements a JSON parser for LLM outputs. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
