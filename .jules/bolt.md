## 2024-05-22 - Destructive Singleton Filtering
**Learning:** The `SkillLoader` singleton destroys its internal state when `load(tags)` is called with filters. This necessitates reloading from disk to restore the full set.
**Action:** When optimizing stateful singletons, ensure the "master" data is preserved (e.g. in a cache) so that derived states (filtered views) can be regenerated without I/O.

## 2024-05-22 - Busy-Wait SQL Preparation
**Learning:** The Orchestrator and Agent loops were re-preparing SQL statements on every tick, causing massive overhead (10k prepares vs 1).
**Action:** Implemented statement caching in `lib/db.js` via `_stmt` helper to reuse prepared statement objects.
