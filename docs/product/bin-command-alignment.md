# Bin Command Alignment Audit (Onboarding-First Mission)

## Why this exists
`/bin` is the operator surface area for Setu. If command behavior is unclear or inconsistent, worker execution quality drops immediately.

This audit maps current command behavior to the onboarding-first mission and recommends practical next steps.

---

## 1) Command inventory

### `bin/setu` (primary CLI)
**Current behavior**
- Process control: `start`, `stop`, `status`
- Onboarding & Hard Gates: `onboarding [run|status|doctor]`
- Messaging/task ops: `chat`, `task` (gated by 100% onboarding requirement)
- Legacy adoption helpers (deprecated aliases): `init`, `adopt`, `doctor`
- Ops tooling: `setup`, `dashboard`, `ignite`

**Mission alignment**
- Now enforces hard gates on mutation workflows and consolidates onboarding aliases into a dedicated `onboarding` namespace.

### `bin/setu-init` (fractal context bootstrapper)
**Current behavior**
- Recursively creates `CONTEXT.md` + `JOURNAL.md` stubs in folders.

**Mission alignment**
- Directionally aligned (documentation scaffolding), but too generic and not tied to onboarding contract artifacts.

### `bin/setu-init.js` (project adoption initializer)
**Current behavior**
- Creates `.setu/`, root/module context files, and sends bus message to Sutradhar.

**Mission alignment**
- Aligned with project onboarding intent, but overlaps conceptually with `setu-init` and naming is ambiguous.

### `bin/setup.js` (interactive model/env wizard)
**Current behavior**
- Configures model providers and writes `.env`.

**Mission alignment**
- Operationally useful, but not connected to onboarding readiness checks.

### `bin/setu-auth.js` (auth profile manager)
**Current behavior**
- Login/list/logout for provider profiles.

**Mission alignment**
- Useful infra tool; onboarding relevance is indirect.

### `bin/dashboard.js` (TUI)
**Current behavior**
- Renders runtime system/agents/tasks/log dashboard.

**Mission alignment**
- Good observability, but no onboarding completeness visibility.

### `bin/test-dashboard.js` (data source smoke test)
**Current behavior**
- Verifies dashboard SQL queries and stats shape.

**Mission alignment**
- Useful health check; should be folded into a clearer validation story.

### `bin/CONTEXT.md`, `bin/JOURNAL.md`
**Current behavior**
- Placeholder context/journal docs for bin folder.

**Mission alignment**
- Aligned in principle, but currently template-only (low execution value).

---

## 2) Keep / Modify / Deprecate recommendations

## Keep
- `setu` as canonical operator CLI.
- `setu-auth.js`, `setup.js`, `dashboard.js`, `test-dashboard.js`.

## Modify
- `setu`:
  - Enforces onboarding hard-gate (100% required) for `/api/tasks` and `setu task`.
  - Created `onboarding` namespace holding `status`, `run`, and `doctor`.
  - `init` and `adopt` marked as deprecated aliases to `setu onboarding run`.
- `dashboard.js`:
  - Added TUI completeness panel.
- `index.html`:
  - Added GUI completeness panel.

## Deprecate
- `setu-init.js` and standalone helpers (like `Vaidya.js` standalone calls) are slowly being folded under `onboarding run` and `onboarding doctor`.
- `init`, `adopt`, `doctor` top-level aliases are deprecated.

---

## 3) Specific alignment actions

1. **Introduce explicit onboarding command surface**
   - Add `setu onboarding-status` alias to standardize worker entry behavior.

2. **Gate worker execution at CLI level**
   - Before task execution commands, run onboarding check and fail-fast with actionable message.

3. **Rationalize init commands**
   - Define:
     - one command for repo onboarding artifact scaffolding,
     - one command for runtime swarm adoption.
   - Rename for intent clarity (example: `setu scaffold-docs` vs `setu adopt-project`).

4. **Upgrade help/usage output**
   - Ensure `setu --help` matches real subcommands and expected outputs.

5. **Expose onboarding status in dashboard**
   - Read and display onboarding completeness % + missing critical artifacts.

---

## 4) Open questions / suggestions for Paril

1. Should onboarding gate be **hard fail** for all worker commands, or only task-changing commands?
2. Do you want one unified init path, or intentionally separate doc scaffolding from swarm adoption?
3. Is `CONTEXT.md`/`JOURNAL.md` still the canonical per-folder format, or should onboarding-first introduce a new lightweight schema?
4. Should onboarding completeness be required in CI immediately (blocking), or start as warning-only for 1-2 weeks?
5. Do you want dashboard onboarding metrics now (quick win), or after command alignment is stable?

**Suggestion:** Start strict on new work, permissive on legacy surfaces. This keeps velocity while enforcing quality where it matters most.
