# Worker Execution Playbook (Setu)

## Goal
Provide a deterministic flow worker agents follow so execution is safe, reviewable, and fast.

## Standard workflow

### Step 0 — Intake and scope lock
Input required from ticket/request:
- problem statement,
- expected outcome,
- constraints,
- priority,
- deadline (if any).

Output:
- explicit scope statement,
- out-of-scope list.

### Step 1 — Onboarding gate (mandatory)
Run:
```bash
setu onboarding status
```

Expected output:
- JSON with artifact status,
- completeness percentage (must be 100%),
- missing items list.

Rules:
- If completeness is below 100% or artifacts are missing/stale, stop implementation.
- Open/execute onboarding-fix ticket first.

### Step 2 — Change plan
Create a short plan with:
- files to touch,
- why each file is touched,
- risk points,
- tests to run.

Expected output:
- a written plan artifact attached to ticket/PR notes.

### Step 3 — Implement in small slices
- Make one logical change slice at a time.
- Keep commits scoped and reversible.
- Avoid drive-by refactors.

Expected output:
- minimal diff aligned to plan.

### Step 4 — Validate
Run relevant checks (example baseline):
```bash
setu onboarding status
setu onboarding doctor --diff
setu onboarding doctor --trend
setu start --help || true
```
(Use project-relevant test/lint commands when ticket specifies them. Use `--trend` to verify health telemetry locally.)

*Governance Verification:* Check if you are resolving drift under strict or balanced profiles: `setu governance profile show`. Change tiers using `setu governance profile set <tier>` to inspect SLA violations locally.

Expected output:
- command results,
- pass/fail summary,
- known limitations.

### Step 5 — Handoff package
Submit with:
- summary of what changed,
- file list,
- test evidence,
- follow-ups/non-goals.

*Reviewer Routing:* Run `setu onboarding doctor --diff --show-ignored` to get the list of suggested owners for the pieces you touched, and explicitly tag them in your PR/ticket. If you're missing an owner mapped locally via `CODEOWNERS` fallback semantics, leverage `setu onboarding doctor --diff --owners-debug` to trace the rule match.

*PR Feedback:* Wait for the GitHub Action to generate the `<!-- setu-governance-report -->` sticky comment on your PR. If it reveals drift, run `setu onboarding doctor --autofix-plan` to extract precisely which commands and files are missing, expediting missing doc alignment incrementally.

Expected output:
- reviewer-ready note with no hidden assumptions and correct owner tags.

---

## Command flow and expected outputs (quick reference)
1. `setu onboarding status`
   - Expect JSON summary with 100% completeness.
2. repo/task-specific validation commands
   - Expect deterministic pass/fail logs.
3. optional focused smoke run
   - Expect no critical runtime errors for touched path.

---

## Parallel Execution & Collision Playbook

When multiple agents are implementing work streams simultaneously, strict isolation guardrails must be adopted to prevent overlapping logic corruptions.

### 1. Structural Task Slicing
Never arbitrarily slice work by line numbers. Instead, assign agents tasks strictly bounded by the `owners_modules` contexts defined within `ONBOARDING.json` (or `CODEOWNERS`). If two workers must touch the same file, the architecture requires decoupling. Escalate the ticket design.

### 2. Branch Naming Conventions
Isolate concurrent task execution into structurally named branches protecting the `main` or `develop` trunks:
- `agent/<ticket-id>/<module-name>`

### 3. Git Sync Strategies
To mitigate silent drift, worker agents MUST:
- Always fetch and rebase `origin/main` (or the target default branch) immediately *before* creating a new PR commit slice.
- Example: `git pull --rebase origin main`

### 4. Collision Resolution Routing
If an automatic git-rebase fails due to an upstream structural collision:
1. **Halt execution:** Do not attempt arbitrary merge resolutions on foreign module paths.
2. **Trace ownership:** Run `setu onboarding doctor --diff --owners-debug` against the conflicted paths.
3. **Route the PR:** Ping the globally mapped owner of the conflicted path natively inside the active PR thread and await triage.

---

## Failure handling rules

### A) Onboarding gate fails
- Do not code feature changes.
- Create or switch to onboarding remediation task.
- Report missing artifacts explicitly.

### B) Command fails unexpectedly
- Capture exact command, stderr, and environment notes.
- Retry once if non-deterministic.
- If repeatable, escalate.

### C) Scope ambiguity discovered mid-task
- Pause coding.
- Raise clarification request with 2-3 concrete options.
- Resume only after decision is recorded.

### D) Hidden coupling / risky dependency
- Document coupling in dependency map update.
- Propose safe sequencing or rollback guard.

---

## Escalation rules
Escalate immediately when:
- onboarding critical artifacts are missing,
- production-risking change is required without documentation,
- ownership conflict blocks decision,
- rollback path is unclear.

Escalation packet must include:
- context,
- blocking issue,
- attempted steps,
- recommended decision options.
