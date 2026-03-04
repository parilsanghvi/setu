---
source_hash: 8b1023faf7f1bf3e
facts_hash: 8b1023faf7f1bf3e
generated_at: 2026-03-04T06:14:33.842Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: .github/workflows

## Purpose
This GitHub Actions workflows folder contains two key files responsible for generating and enforcing governance and onboarding compliance in the codebase. The `governance-digest.yml` file runs a job that generates and uploads a report, while the `onboarding-gate.yml` file checks pull requests for completeness before merging them into main branches.

## Key Files
| File | Role |
|------|------|
| governance-digest.yml | Generates and uploads governance digest reports on Mondays. |
| onboarding-gate.yml | Ensures pull request onboarding compliance and documentation quality. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Follows standard GitHub Actions workflow naming conventions.
Likely: Uses environment variables to manage sensitive data, such as the Ubuntu 20.04 LTS environment in `governance-digest.yml`.

## Cross-References
- [governance-digest.yml](../../../files/.github/workflows/governance-digest.yml.md)
- [onboarding-gate.yml](../../../files/.github/workflows/onboarding-gate.yml.md)

