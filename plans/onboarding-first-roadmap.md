# Onboarding-First Roadmap (Setu)

## Why this shift now
Setu is moving to a **doc-first execution model**: no feature work starts until the repo is explainable by artifacts a new engineer (or worker agent) can trust.

This is not documentation theater. It is an execution control system:
- fewer blind edits,
- safer parallel work,
- faster recoveries,
- higher merge quality.

## Product direction (2026)
Setu should operate like a high-context, low-confusion engineering system:
1. **Onboarding contract first** — repository understanding is a prerequisite, not an optional pre-task.
2. **Execution playbooks second** — workers follow deterministic flows with explicit outputs.
3. **Implementation third** — tasks can be delegated safely because understanding is measurable.
4. **Status always visible** — onboarding completeness is machine-checkable (`onboarding:status`).

## Non-negotiable onboarding contract
Before any task is executed, the assigned worker must have a valid onboarding packet covering:
- repository tree map,
- per-file purpose notes for touched scope,
- folder summaries,
- dependency map,
- runbook for build/test/run/rollback.

If contract completeness is below threshold (defined in `docs/product/onboarding-contract.md`), work **must not start** except a specific onboarding-fix ticket.

## Milestones and acceptance criteria

### M0 — Contract Foundation (Week 1)
**Goal:** Define what “onboarded” means in Setu.
- Deliver onboarding contract doc.
- Deliver worker execution playbook.
- Deliver implementation backlog and priorities.
- Add status checker script + npm command.

**Acceptance criteria**
- `docs/product/onboarding-contract.md` exists and is review-approved.
- `docs/product/worker-execution-playbook.md` exists and is review-approved.
- `docs/product/implementation-backlog.md` exists with P0/P1/P2 tickets.
- `npm run onboarding:status` prints JSON and returns non-zero when incomplete.

### M1 — Repo Baseline Documentation (Week 1-2)
**Goal:** Cover current repo state with minimum viable onboarding artifacts.
- Generate/update repo tree snapshot.
- Add folder summaries for all top-level product folders.
- Add dependency map for runtime + module boundaries.
- Publish runbook with startup, tests, and failure recovery.

**Acceptance criteria**
- Onboarding completeness >= 70%.
- Every top-level folder has an owner and summary.
- New worker can run app and basic tests in <= 30 minutes using docs only.

### M2 — Gate in Worker Workflow (Week 2)
**Goal:** Make onboarding contract an enforced precondition.
- Workers must run onboarding status before execution.
- PR template/checklist includes onboarding checks.
- Ticket intake requires onboarding impact section.

**Acceptance criteria**
- 100% of new worker runs include onboarding status JSON in output.
- No ticket starts without declared touched files + documentation plan.
- Onboarding completeness >= 85% for active surfaces.

### M3 — Quality Hardening (Week 3)
**Goal:** Improve reliability and consistency of artifacts.
- Add periodic doc drift checks.
- Add examples of good/bad task briefs.
- Create escalation path for ambiguous ownership and missing docs.

**Acceptance criteria**
- Doc drift incidents reduced week-over-week.
- Critical-path folders maintain >= 95% artifact coverage.
- Escalations resolved within agreed SLA (same business day).

### M4 — Scale Parallel Delivery (Week 4+)
**Goal:** Safely run multiple workers in parallel with low conflict.
- Standardize ticket slicing based on documented boundaries.
- Track handoff quality metrics.
- Create onboarding score trend dashboard/log.

**Acceptance criteria**
- At least 3 parallel workers deliver without rework collisions.
- Rework from misunderstanding reduced by >50% vs baseline.
- Onboarding completeness sustained >= 90% for two consecutive weeks.

## Key risks and mitigations

### Risk 1: “Docs slow us down” perception
**Mitigation:** Keep artifacts lightweight and task-scoped; enforce only what improves execution safety.

### Risk 2: Docs drift from code
**Mitigation:** Add ownership by folder + onboarding checks in task lifecycle and PR checklist.

### Risk 3: Workers bypass contract under deadline pressure
**Mitigation:** Hard gate: incomplete onboarding only permits onboarding-fix tickets.

### Risk 4: Over-specification creates maintenance burden
**Mitigation:** Use tiered quality bar (critical path strict, peripheral path practical).

### Risk 5: Ambiguous ownership
**Mitigation:** Every top-level area gets explicit owner and escalation path in runbook.

## Operating principle
If we cannot explain the change surface clearly, we are not ready to change it.
