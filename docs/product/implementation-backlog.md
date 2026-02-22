# Implementation Backlog — Onboarding-First Model

## Prioritization legend
- **P0**: Blocker for safe execution. Do first.
- **P1**: Strong multiplier for speed/quality.
- **P2**: Nice-to-have hardening/scaling.

---

## P0 Tickets

### P0-1: Define canonical onboarding artifacts and ownership
**Scope**
- Finalize artifact list and assign owners for each required document.

**Touched files**
- `docs/product/onboarding-contract.md`
- `docs/repo-map.md`
- `docs/operations/how-to-run.md`

**Test strategy**
- Manual review checklist pass.
- `setu onboarding status` confirms artifact presence.

### P0-2: Baseline folder summaries for active directories
**Scope**
- Add/expand summaries for `backend/`, `frontend/`, `lib/`, `scripts/`, `tests/`.

**Touched files**
- `docs/repo-map.md`
- `docs/architecture/overview.md`
- `docs/current-state.md`

**Test strategy**
- Reviewer spot-check: can a new worker locate change points without verbal guidance?

### P0-3: Dependency map for critical runtime paths
**Scope**
- Document service startup graph, DB touchpoints, API-to-lib coupling, socket/event flow.

**Touched files**
- `docs/architecture/data-flow.md`
- `docs/architecture/components.md`

**Test strategy**
- Compare docs against actual startup code and imports.
- Validate no major module edge is missing.

### P0-4: Runbook completeness and recovery flow
**Scope**
- Ensure runbook has setup, run, test, troubleshooting, rollback.

**Touched files**
- `docs/operations/how-to-run.md`
- `docs/operations/troubleshooting-basics.md`

**Test strategy**
- Fresh operator walkthrough using only runbook.
- Record time-to-first-success and blockers.

### P0-5: Enforce onboarding gate in worker SOP
**Scope**
- Update worker process docs/templates to require onboarding status output before coding.

**Touched files**
- `docs/product/worker-execution-playbook.md`
- task/PR template files (where present)

**Test strategy**
- Audit 3 sample task runs for gate compliance.

---

## Phased plan for quick, safe command alignment edits (no broad refactor)

### Phase A (same day, low-risk)
- Add `setu` help text alignment with real command list.
- Add `setu onboarding-status` passthrough command.
- Document command intent in `docs/product/bin-command-alignment.md`.

### Phase B (1-2 days, guarded behavior)
- Add optional onboarding precheck before task-mutating command paths.
- Introduce clear warning/fail messages with remediation links.

### Phase C (after validation)
- Decide init command consolidation (`setu-init` vs `setu-init.js`) and add deprecation notice to one path.
- Add dashboard tile for onboarding completeness JSON.

## P1 Tickets

### P1-1: Add per-file doc templates for touched-scope notes
**Scope**
- Standard template for file purpose, side effects, and test impact.

**Touched files**
- `docs/product/worker-execution-playbook.md`
- `docs/product/onboarding-contract.md`

**Test strategy**
- Apply template in 2 pilot tickets; verify reviewer approval speed.

### P1-2: Add onboarding status to CI/pre-merge checks
**Scope**
- Wire `setu onboarding status` into CI as warning, then blocker.

**Touched files**
- CI config files (repo-specific)
- `scripts/onboarding-status.js`

**Test strategy**
- Simulate missing artifact and confirm CI behavior.

### P1-3: Doc drift review cadence [COMPLETED - Phase 3, 3.1, 3.2, 3.3 & 3.4]
**Scope**
- Automated doc/code drift checklist for PRs and local preflight via `setu onboarding doctor --diff`.
- Includes configurable rules via `.setu/drift-ignore.json`.
- Strict CI validation using `GITHUB_EVENT_PATH` API hooks to prevent stale git depth false-positives via `--strict-diff`.
- Robust recursive matching `CODEOWNERS` fallback with `--owners-debug` tracing rules.
- Local telemetry via `setu onboarding doctor --trend`, equipped with max row/day retention pruning and UI Dashboard tiles.
- Granular Ownership SLA enforcement via `.setu/ownership-policy.json`.
- Dynamic Governance Profiles scaling SLA/Telemetry rigidity via `.setu/governance-profile.json` (`strict`/`balanced`).
- Automated idempotent GitHub Action Pull Request PR feedback comments natively tracing drift.
- Weekly Governance Digest scheduled workflow computing pipeline metrics every 7 days.

**Touched files**
- `lib/onboarding/drift.js`
- `lib/onboarding/governance-profiles.js`
- `bin/setu`
- CI configuration (`onboarding-gate.yml`, `governance-digest.yml`)
- `scripts/drift-step-summary.js`
- `bin/dashboard.js` & `lib/server.js`

**Test strategy**
- Drift enforcement is guaranteed on all active PRs. Manual weekly scrub no longer necessary for covered scope. Reviewers are automatically pinged.

---

## P2 Tickets

### P2-1: Onboarding quality score history [COMPLETED - Phase 4]
**Scope**
- Persist onboarding status snapshots over time for trend visibility.
- Include CLI outputs mapping string history via `setu onboarding status --trend`.
- Build UI components native to `dashboard.js` and `frontend/dashboard/index.html` tracing visual velocity.

**Touched files**
- `scripts/onboarding-status.js`
- `bin/setu`
- `bin/dashboard.js` & `lib/server.js`
- `frontend/dashboard/index.html`

**Test strategy**
- Generate daily snapshots; verify trend readability.

### P2-2: Parallel execution conflict playbook [COMPLETED - Phase 5]
**Scope**
- Add guidelines for branch/task slicing by documented boundaries.

**Touched files**
- `docs/product/worker-execution-playbook.md`

**Test strategy**
- Run parallel dry run with 2-3 workers; track collision rate.

### P2-3: Example library (good vs bad onboarding packets) [COMPLETED - Phase 6]
**Scope**
- Create sample packets to calibrate quality quickly.

**Touched files**
- `docs/product/` examples directory (new)

**Test strategy**
- Reviewer agreement >80% on sample quality grading.
