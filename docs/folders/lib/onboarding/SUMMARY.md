---
source_hash: fba320174a5ca551
facts_hash: fba320174a5ca551
generated_at: 2026-02-25T12:37:48.351Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/onboarding

## Purpose
This folder contains a set of critical components for the onboarding process in a GitHub repository, responsible for parsing code ownership rules, analyzing changes to the codebase, and generating documentation. It serves as a crucial component in enforcing code ownership permissions and ensuring the quality of documentation in repositories. The folder is essential for maintaining the integrity and consistency of the codebase.

## Key Files
| File | Role |
|------|------|
| changed-files.js | Resolves changed files in a Git repository by checking the GitHub API and local Git diff results. |
| codeowners.js | Parses CODEOWNERS files to match code ownership rules against given paths. |
| doc-enricher.js | Extracts structured JSON facts from source files, including symbols, imports, exports, side effects, and dependencies. |
| doc-facts.js | Produces structured JSON facts about source files using lightweight regex heuristics. |
| doc-links.js | Generates canonical doc paths and relative links between docs for deterministic documentation formatting. |
| drift.js | Analyzes changes to the codebase and determines which files require attention and potential issues with dependencies or documentation. |
| generator.js | Creates essential documentation and configuration files for a project's repository. |
| governance-profiles.js | Provides configuration profiles for the system, allowing users to customize settings such as telemetry and ownership policies. |
| paths.js | Constructs paths within the `.setu` directory of the repository using utility functions. |
| status.js | Checks the quality of documentation in a repository, including detecting populated doc files, scoring doc quality, and computing repo-wide reports. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Follows strict coding conventions for JavaScript file structure and naming.
Likely: Utilizes deterministic data structures to ensure reproducibility and accuracy in documentation generation.
Likely: Adheres to modular design principles, separating concerns into distinct files and functions.

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

