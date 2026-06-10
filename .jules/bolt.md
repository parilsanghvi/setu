## 2026-06-10 - Regex Recompilation Bottleneck
**Learning:** Instantiating `new RegExp()` inside a tight iteration loop, even with identical pattern source strings, carries a significant performance overhead compared to reusing a pre-compiled `RegExp` object.
**Action:** When applying global regular expressions iteratively across many items (e.g., parsing multiple files), always reuse pre-compiled regex instances and manually reset their `lastIndex = 0` before each `exec()` call to skip recompilation.
