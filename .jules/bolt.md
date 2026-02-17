## 2024-05-22 - Destructive Singleton Filtering
**Learning:** The `SkillLoader` singleton destroys its internal state when `load(tags)` is called with filters. This necessitates reloading from disk to restore the full set.
**Action:** When optimizing stateful singletons, ensure the "master" data is preserved (e.g. in a cache) so that derived states (filtered views) can be regenerated without I/O.
