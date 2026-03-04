---
source_hash: 5fffc7fe1ebb914e
facts_hash: b80610d141a53007
generated_at: 2026-03-04T07:11:46.098Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: .github/workflows/onboarding-gate.yml

## Purpose
This YAML file defines a GitHub Actions workflow named "Onboarding Gate" that checks the completeness and quality of documentation for a repository, ensuring it meets certain standards before allowing pull requests to proceed.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `actions/checkout` | Checks out the repository. |
| `actions/setup-node` | Sets up Node.js on the workflow environment. |
| `node scripts/onboarding-status.js` | Runs a script to check onboarding completeness. |
| `node bin/setu onboarding quality` | Evaluates documentation quality metrics. |
| `node scripts/check-doc-links.js` | Reports on broken doc links and GitHub blob URLs. |
| `node bin/setu onboarding doctor` | Checks for docs drift and reports issues. |
| `peter-evans/create-or-update-comment` | Creates or updates a pull request comment. |

## Internal Logic
The workflow executes in the following sequence:

1. Checks out the repository using `actions/checkout`.
2. Sets up Node.js on the environment with `actions/setup-node`.
3. Installs dependencies and runs scripts to check onboarding completeness, documentation quality, broken doc links, and docs drift.
4. Generates a PR comment with report summaries.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./quality.json` | Yes | Retrieves documentation quality metrics from a file. |
| `node modules/...` | No | Imports dependencies required for the workflow. |

## Side Effects
- console_output: The script outputs comments and error messages to the GitHub Actions log.
- network: The workflow makes HTTP requests to GitHub and possibly external APIs when generating reports.

## Dependents
No known dependents.

## Cross-References
- `quality.json` _(doc not yet generated)_


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `log` | `lib/Context.js` | [Doc](../../lib/Context.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../../lib/SessionLogger.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](../../tests/test-token-estimation.js.md) |

*No downstream callers detected.*
