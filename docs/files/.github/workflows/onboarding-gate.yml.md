---
source_hash: 5fffc7fe1ebb914e
facts_hash: c86c228925b3a424
generated_at: 2026-03-03T07:03:04.538Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: .github/workflows/onboarding-gate.yml

## Purpose
This GitHub Actions file defines an onboarding gate that checks the completeness and quality of documentation for a repository before allowing pull requests to be merged. The gate uses Node.js scripts to perform various checks, including checking for placeholder documentation, broken doc links, and docs drift (PR preflight). If any issues are found, the gate will report errors.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `check-onboarding` | Function | Checks onboarding completeness using scripts |
| `quality_check` | Function | Runs quality check for documentation using Node.js script |
| `check_doc_links` | Function | Checks for broken doc links using Node.js script |
| `doctor` | Function | Performs docs drift (PR preflight) and quality checks |
| `create-or-update-comment` | Function | Generates a PR comment using the GitHub API |

## Internal Logic
The main execution flow of this file involves the following key functions:

- `check-onboarding`: Runs the onboarding completeness check using scripts.
  - This function uses the `onboarding-status.js` script to determine if the onboarding is complete.
  - If not, it reports an error and exits with a non-zero exit code.

- `quality_check`: Runs the quality check for documentation using Node.js.
  - This function uses the `setu onboarding quality --json` command to get quality metrics from the script.
  - It then prints these metrics to the GitHub Actions step summary.

- `check_doc_links`: Checks for broken doc links using Node.js.
  - This function runs the `check-doc-links.js` script to detect broken links.
  - If any are found, it reports an error and sets a GitHub Environment variable to indicate this.

- `doctor`: Performs docs drift (PR preflight) and quality checks.
  - This function uses the `setu onboarding doctor --diff` command to perform the PR preflight check.
  - It then runs the quality check for documentation using the `quality_check` function.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `actions/checkout` | Yes | Provides Git actions functionality |
| `actions/setup-node` | Yes | Sets up Node.js on the workflow run |
| `node` | Yes | Executes Node.js scripts and commands |
| `fs` | Yes | Provides file system access for reading JSON files |
| `require` | Yes | Enables require() function to load modules |

## Side Effects
- console_output: The gate reports errors and prints metrics to the GitHub Actions step summary using `echo`.
- network: The gate may make API calls to check documentation quality, detect broken links, or generate a PR comment.

## Dependents
No known dependents.

## Cross-References
- `quality.json` _(doc not yet generated)_
