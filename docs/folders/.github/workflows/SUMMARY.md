---
source_hash: 8b1023faf7f1bf3e
facts_hash: 8b1023faf7f1bf3e
generated_at: 2026-03-03T07:55:31.055Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: .github/workflows

## Purpose
This GitHub Actions workflow and onboarding gate are responsible for ensuring the quality and completeness of repository documentation, as well as producing a weekly governance report. The folder enforces best practices for maintaining accurate and up-to-date documentation. Key responsibilities include automated checks and reporting mechanisms.

## Key Files
| File | Role |
| `governance-digest.yml` | Defines a GitHub Actions workflow that runs on Mondays at 9:00 AM UTC, producing a weekly digest report of governance actions. |
| `onboarding-gate.yml` | Checks the completeness and quality of documentation for a repository before allowing pull requests to be merged. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Conformity to GitHub Actions workflow syntax and structure.
Likely: Regular usage of Markdown formatting in README files.
Enforce: Proper indentation and spacing throughout all JavaScript code files.

## Cross-References
- [governance-digest.yml](../../../files/.github/workflows/governance-digest.yml.md)
- [onboarding-gate.yml](../../../files/.github/workflows/onboarding-gate.yml.md)

