# Release Readiness Report: v0-onboarding-governance (Final v2)

**Date:** 2026-02-22  
**Agent:** Stabilization Pass #3 (target: clean GO)

---

## Files Changed (grouped by fix)

### Fix 1: `strict_diff_failed` boolean contract
- `lib/onboarding/drift.js` — wrapped in `Boolean()` to guarantee strict `true`/`false`

### Fix 2: `/api/tasks` gate JSON unification
- `index.js` — updated POST `/api/tasks` to return `{ error, missing, details, remediation }` matching `lib/server.js`

### Fix 3: Trend API route unification
- `index.js` — added `/api/onboarding-trend` and `/api/drift-trend` routes (same logic as `lib/server.js`)

### Fix 4: Ownership in drift telemetry
- `lib/onboarding/drift.js` — drift history records now persist `ownership: { unowned_files, unowned_count, ownership_source }`

### Fix 5: Expanded ignore dirs
- `lib/onboarding/status.js` — added `.claude`, `.cursor`, `.qwen`, `.gemini` to `IGNORE_DIRS`

---

## Validation Matrix

| # | Command / Scenario | Result | Key Output |
|---|:-------------------|:------:|:-----------|
| 1 | `setu onboarding status --json --fast` | PASS | Correctly detects stale / incomplete |
| 2 | `setu onboarding status --json --strict` | PASS | Full recompute, same result |
| 3 | `setu onboarding doctor --diff --json --strict-diff --base HEAD~1` | PASS | Reports `changed_files_source`, `base_ref_used` |
| 4 | `setu onboarding doctor --trend --json` | PASS | 14 runs, sources split, top missing docs |
| 5 | `setu onboarding doctor --help` | PASS | Prints usage, does not boot Vaidya |
| 6 | API task mutation FAIL (onboarding incomplete) | PASS | HTTP 403 `{ error, missing, details, remediation }` |
| 7 | API task mutation SUCCESS (onboarding complete) | PASS | `{ id: "TASK-1022", status: "TODO" }` |
| 8 | Strict-diff zero-file in PR context | PASS | `🛑 STRICT DIFF CHECK FAILED` |
| 9 | Governance profile display | PASS | STRICT profile applied, enforcement active |
| 10 | `strict_diff_failed` type check | PASS | `typeof: boolean`, value: `false` |
| 11 | Drift telemetry ownership persistence | PASS | `unowned_count: 7`, `ownership_source: none` |
| 12 | `/api/drift-trend` via index.js | PASS | Route exists, returns trend data |

---

## Known Residual Risks

| Risk | Severity | Notes |
|:-----|:--------:|:------|
| `owners_modules` empty in ONBOARDING.json | Medium | Ownership mapping not yet configured. `--owners-debug` won't resolve. |
| Shallow clone returns 0-file diff silently | Low | Expected; `--strict-diff` catches this in CI. |
| `ONBOARDING.json` stale after each commit | Low | By design; re-run `setu onboarding run` to refresh. |

---

## Recommendation

**GO — Clean.** 🟢

All 5 user-identified caveats from the prior pass are resolved:
1. ✅ `strict_diff_failed` is always strict boolean
2. ✅ `/api/tasks` gate JSON contract unified across `index.js` and `lib/server.js`
3. ✅ Trend API routes (`/api/onboarding-trend`, `/api/drift-trend`) present in active runtime
4. ✅ Drift telemetry records now include ownership summary
5. ✅ Ephemeral tool folders (`.claude`, `.cursor`, `.qwen`, `.gemini`) added to ignore list
