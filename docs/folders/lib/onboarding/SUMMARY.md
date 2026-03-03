---
source_hash: 8c098d201d8c6767
facts_hash: 8c098d201d8c6767
generated_at: 2026-03-03T07:59:21.600Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/onboarding

## Purpose
This folder contains a suite of utility functions and modules that support the onboarding system, including code ownership parsing, documentation enrichment, and repository analysis.

## Key Files
| File | Role |
| changed-files.js | Resolves changed files between different Git references in an onboarding system |
| codeowners.js | Parses and matches code ownership rules in a CODEOWNERS file |
| doc-enricher.js | Extracts structured JSON facts from source code without LLMs |
| doc-facts.js | | 
| doc-links.js | Resolves canonical doc paths and generates relative links |
| drift.js | Analyzes code drift in a repository by detecting changes and identifying owners |
| generator.js | Generates necessary documentation files and updates the `ONBOARDING.json` manifest |
| governance-profiles.js | Manages governance profiles and ownership policies |
| paths.js | Provides utility functions for working with Setu documentation system paths |
| status.js | Computes the quality of documentation within a repository |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Follows standard JavaScript coding conventions.
Likely: Uses consistent naming conventions throughout the codebase.
Likely: Adheres to the principle of least surprise, ensuring functions and modules have clear and intuitive APIs.

## Cross-References
- [changed-files.js](../../../files/lib/onboarding/changed-files.js.md)
- [codeowners.js](../../../files/lib/onboarding/codeowners.js.md)
- [doc-enricher.js](../../../files/lib/onboarding/doc-enricher.js.md)
- [doc-facts.js](../../../files/lib/onboarding/doc-facts.js.md)
- [doc-links.js](../../../files/lib/onboarding/doc-links.js.md)
- [drift.js](../../../files/lib/onboarding/drift.js.md)
- [generator.js](../../../files/lib/onboarding/generator.js.md)
- [governance-profiles.js](../../../files/lib/onboarding/governance-profiles.js.md)
- [paths.js](../../../files/lib/onboarding/paths.js.md)
- [status.js](../../../files/lib/onboarding/status.js.md)

