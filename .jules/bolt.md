## 2024-05-18 - Global RegExp Reuse with lastIndex Reset
**Learning:** Re-instantiating `new RegExp` objects inside tight loops (like iterating over syntax patterns to parse files in `lib/onboarding/doc-facts.js`) is a significant performance bottleneck.
**Action:** Reuse pre-compiled regular expression instances and explicitly reset `pat.re.lastIndex = 0` before calling `.exec()` inside loops to avoid recompilation overhead.
