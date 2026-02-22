# Onboarding Contract (Setu)

## Purpose
This contract defines the **minimum required artifacts** before any worker agent starts implementation work.

No contract, no coding.

## Required artifacts (must exist before task execution)

## Required Target Schema (must exist and be 100% complete)

### 1) ONBOARDING.json
- Machine-readable manifest.
- Must include: `repo`, `default_branch`, `head_commit`, `generated_at`, `completeness_percent`, `owners/modules`, `checks`.
- Must reflect 100% completeness for task modification to proceed.

### 2) Core Entrypoints
- `docs/INDEX.md` (General project overview)
- `docs/tree.md` (Repository tree map)
- `docs/dependencies.md` (Dependency graph and critical paths)
- `docs/runbook.md` (Setup, run, test, and troubleshooting commands)
- `docs/current-state.md` (Current architectural and operational state)

### 3) File & Folder Details
- `docs/files/**`: One documentation file per mapped application code file.
- `docs/folders/**/SUMMARY.md`: High-level folder responsibility and ownership rollups.

---

## Quality bar checklist (pass/fail)

### Clarity
- [ ] A new engineer can identify where to make a change without asking for direction.
- [ ] Artifact language is concrete (no vague “handles stuff”).

### Accuracy
- [ ] Commands are copy-paste runnable.
- [ ] Paths and filenames are correct.
- [ ] Dependency statements match current code.

### Coverage
- [ ] All expected touched files are documented before execution.
- [ ] All top-level active folders have summaries.
- [ ] Critical dependencies are mapped.

### Operability
- [ ] Runbook includes happy path + failure path.
- [ ] At least one validation command exists per major subsystem.

### Maintenance
- [ ] Each artifact has an owner.
- [ ] Last-updated date is present for critical onboarding docs.

---

## Definition of Done (Onboarding)
Onboarding is considered **Done** when all conditions below are true:
1. All required schema artifacts exist and pass checklist.
2. `setu onboarding status` reports:
   - completeness = 100% overall,
   - no missing artifacts,
   - `ONBOARDING.json` commit matches current git HEAD.
3. A worker agent can produce a valid task plan with touched files + test strategy using docs only.
4. Reviewer confirms no blocking ambiguity remains in the intended change surface.

If any condition fails, only onboarding remediation tickets may proceed.

## PR Policy & Drift Enforcement
- **Code/Docs Drift Prevented:** Every PR must include corresponding docs updates for any modified core or source files.
- **Drift Rule Definitions:**
  - When a file (`src/foo.js`) is changed, its corresponding file doc (`docs/files/src/foo.js.md`) MUST be present.
  - When a file is changed, the `SUMMARY.md` in its folder and every parent folder up to the repository root MUST be present.
  - **Source Resolution:** In CI, drift validation prioritizes GitHub's PR file API to prevent git-fetch depth blind spots. It falls back to `git diff` for local runs.
  - **Strict-Diff Sanity Checks:** The `--strict-diff` flag (default in CI) will fail the CI gate if GitHub PR metadata is present but zero file changes are detected, guarding against silent passes.
  - **Base Ref Resolution:** Drift check determines the comparison base in this order: `--base` flag > `SETU_DRIFT_BASE` env > `ONBOARDING.json.default_branch` > `origin/main` > `HEAD~1...HEAD`.
  - **Ignore Policy:** Paths, extensions, and globs defined in `.setu/drift-ignore.json` (such as `logs/**` and `.lock` files) are excluded from docs requirement enforcement.
  - **Telemetry Retention:** Drift evaluations are appended locally to `.setu/drift-history.jsonl` with an automatic rolling retention of the last 30 days (max 500 records), customizable via `SETU_DRIFT_HISTORY_MAX` or `SETU_DRIFT_HISTORY_DAYS`.
  - **Ownership SLA:** A configured `.setu/ownership-policy.json` will flag if any unowned files fall inside strictly governed glob paths (e.g. `src/**`). Depending on `mode` (`warn` | `enforce`), this can natively block the drift checks entirely.
  - **Governance Profiles:** The system scales rigidity using standard `.setu/governance-profile.json` tiers (`strict`, `balanced`, `legacy`). These automate strict-diff flags, SLAs, and data retention durations natively. Enable them via `setu governance profile set <tier>`.
- **CI Gate:** The GitHub Actions `Onboarding Gate` workflow includes a preflight drift check (`setu onboarding doctor --diff --strict-diff`). A non-zero drift results in a hard failure of the CI pipeline.
- **PR Feedback Loop:** CI automatically comments idempotently on the Pull Request evaluating missing docs, generating suggested reviewer tags, and listing unowned file SLA violations.
- **Remediation Autofix:** Developers can execute `setu onboarding doctor --autofix-plan` to extract precisely which commands and files are missing, expediting missing doc alignment.
- **Reviewer Routing & Tracing:** The drift check leverages the `owners_modules` map in `ONBOARDING.json`. It will inherently fallback to full-regex parsed semantics (e.g., `**`, `*`, `?`) natively interpreted from `.github/CODEOWNERS` or `CODEOWNERS`. Use `setu onboarding doctor --diff --owners-debug` to debug any path resolution.
- **Weekly Digest:** Scheduled pipelines orchestrate `setu onboarding doctor --digest-weekly` parsing trend data for the top P95 drift gaps, missing docs, and unowned paths every 7 days.
