---
source_hash: 365dca53b5142270
facts_hash: 365dca53b5142270
generated_at: 2026-03-04T06:17:51.231Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/utils

## Purpose
This `lib/utils/` folder contains two utility files: `JsonParser.js` and `pkce.js`. The former provides a class for parsing JSON from potentially messy LLM outputs, while the latter offers a function to generate Public Key Cryptography for Session (PKCS#8) parameters in OpenID Connect authentication protocols. This folder exists to provide a centralized location for these specific utility functions.

## Key Files
| File | Role |
| JsonParser.js | Parses JSON from messy LLM outputs using direct parsing, Markdown code block extraction, and substring extraction strategies. |
| pkce.js | Generates Public Key Cryptography for Session (PKCS#8) parameters in OpenID Connect authentication protocols. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Code is written in JavaScript.
Likely: All functions are documented with clear, descriptive comments.
The folder follows the standard convention of using lowercase file names and following camelCase naming for variables and functions within files.

## Cross-References
- [JsonParser.js](../../../files/lib/utils/JsonParser.js.md)
- [pkce.js](../../../files/lib/utils/pkce.js.md)

