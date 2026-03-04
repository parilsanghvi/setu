---
source_hash: 8ab8135f1bd85851
facts_hash: 8ab8135f1bd85851
generated_at: 2026-03-04T06:17:36.810Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/onboarding

## Purpose
This lib/onboarding folder contains critical components for onboarding and governance within a codebase, including file resolution, documentation enrichment, drift analysis, and generation of onboarding documentation.

## Key Files
| File | Role |
| changed-files.js | Resolves changed files in a Git repository. |
| codeowners.js | Parses and matches codeowner rules to determine ownership of files. |
| doc-enricher.js | Extracts deterministic facts from source files for use in documentation enrichment. |
| doc-facts.js | Generates structured JSON facts from source code with language-agnostic patterns. |
| doc-links.js | Resolves canonical links to documentation files and generates relative links between them. |
| drift.js | Computes the drift in a codebase, identifying changed files and owners of those changes. |
| generator.js | Generates onboarding documentation for a repository, including templates and file summaries. |
| governance-profiles.js | Manages governance profiles, handling profile configuration and synchronization with ownership policies. |
| paths.js | Provides utility functions for managing the setu directory within the repository. |
| status.js | Evaluates the quality of documentation within a repository, detecting populated doc files and calculating coverage. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The lib/onboarding folder follows a strict coding convention where all exported functions are documented with JSDoc comments.
Likely: All file paths in the repo are relative to the REPO_ROOT constant defined in paths.js.
Likely: The drift analysis in drift.js is performed within a scope determined by configuration settings to avoid false positives.

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

