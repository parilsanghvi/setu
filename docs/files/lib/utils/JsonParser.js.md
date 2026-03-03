---
source_hash: 5d37e9bd39501cf3
facts_hash: 0194a50ff76c075b
generated_at: 2026-03-03T07:26:59.375Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: lib/utils/JsonParser.js

## Purpose
This file exports a utility class named `JsonParser` that provides methods for parsing JSON strings from potentially messy LLM outputs, attempting to fix common formatting issues such as Markdown code blocks and substring extraction.

| Export | Type | Description |
|--------|------|-------------|
| JsonParser | cjs_default | Exports the `JsonParser` utility class for use by other modules. |

## Internal Logic
The main execution flow of the `JsonParser` class involves attempting to parse a JSON string using three strategies:
- Directly parsing the input string with `JSON.parse`.
- Extracting Markdown code blocks that contain JSON data.
- Searching for the first `{` and last `}` in the string to extract a potential JSON substring.

The class uses these strategies in sequence, ignoring any errors encountered during parsing and returning null if all attempts fail.

| Key Function | Description |
|--------------|-------------|
| `parse`       | Attempts to parse a JSON string from the input text using three different strategies. |

## Dependencies
No dependencies are imported by this module.

## Side Effects

## Dependents
No known dependents.

## Cross-References
No cross-references.
