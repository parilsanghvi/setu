---
source_hash: 774d30d8be41fe38
facts_hash: 2554d5a358fcc69f
generated_at: 2026-02-25T11:52:48.211Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: .github/workflows/onboarding-gate.yml

## Purpose
This YAML file defines a GitHub Actions workflow named "Onboarding Gate" that checks the completeness and quality of onboarding data for a repository, including documentation links and doc drift, before allowing a pull request to be merged.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `check-onboarding` | Checks the onboarding completeness. |
| `quality_check` | Inspects the quality of documentation. |
| `check-doc-links` | Verifies the integrity of documentation links. |
| `docs-drift` | Detects doc drift before merging a PR. |

## Internal Logic
The workflow consists of several jobs that run sequentially:
- The first job, `check-onboarding`, executes a Node.js script to check onboarding completeness and updates the GitHub step summary with the results.
- The second job, `quality_check`, uses another Node.js script to evaluate documentation quality and displays the findings in the GitHub step summary.
- The third job, `check-doc-links`, runs a JavaScript script to report on broken doc links and GitHub blob URLs.
- The fourth job, `docs-drift`, performs a preflight check for pull requests by comparing the target branch's contents with those in the repository.
- The fifth job generates a PR comment based on the results of the previous steps.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `actions/checkout` | Yes | Fetches repository code. |
| `actions/setup-node` | Yes | Installs Node.js version 20. |
| `npm` | Yes | Runs npm commands (e.g., `ci`, `install`). |
| `./quality.json` | Yes | Specifies quality threshold configuration. |

## Side Effects
- console_output: The workflow updates the GitHub step summary with log messages, comments, and error indicators.
- network: The workflow fetches repository code and performs API requests to GitHub during its execution.

## Dependents
No known dependents.

## Cross-References
- `quality.json` _(doc not yet generated)_
