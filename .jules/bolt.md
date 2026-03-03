## 2024-05-22 - Destructive Singleton Filtering
**Learning:** The `SkillLoader` singleton destroys its internal state when `load(tags)` is called with filters. This necessitates reloading from disk to restore the full set.
**Action:** When optimizing stateful singletons, ensure the "master" data is preserved (e.g. in a cache) so that derived states (filtered views) can be regenerated without I/O.

## 2024-05-22 - Busy-Wait SQL Preparation
**Learning:** The Orchestrator and Agent loops were re-preparing SQL statements on every tick, causing massive overhead (10k prepares vs 1).
**Action:** Implemented statement caching in `lib/db.js` via `_stmt` helper to reuse prepared statement objects.

## 2024-05-23 - Fast Path Onboarding Check Optimization
**Learning:** The `getOnboardingStatus({ fast: true })` check ran unconditionally synchronously scanned the file system if `ONBOARDING.json` was stale (head_commit mismatch). Since it's used in hot paths like `/api/tasks`, a 500ms block occurs on every request in development or when testing changes before the ONBOARDING is formally regenerated.
**Action:** When offering a `{ fast: true }` cache path, preserve the cached data even if it's mildly stale (flagging `stale: true`) instead of dropping to the heavy recalculation, if the caller explicitly opts-in to the fast path.

## 2024-05-23 - API Endpoint Onboarding Check Fast Path
**Learning:** The `/api/onboarding` endpoint was calling `getOnboardingStatus()` without options, triggering a ~500ms synchronous file system scan on every request. This causes unnecessary latency when polling or loading the dashboard.
**Action:** Use `getOnboardingStatus({ fast: true })` in API endpoints that require checking onboarding status to avoid blocking the event loop with synchronous file system scans, leveraging the cached `ONBOARDING.json` data instead.
