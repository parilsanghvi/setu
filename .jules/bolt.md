## 2026-06-08 - Reusing Regex in JS Loops
**Learning:** In JavaScript (V8), compiling new regular expressions inside a tight loop with `new RegExp()` introduces measurable GC and CPU overhead. When the pattern is static, reusing the pre-compiled regex and manually resetting its state with `.lastIndex = 0` significantly accelerates extraction (by ~10%).
**Action:** Always pre-compile static regular expressions outside of parsing loops and manually reset `.lastIndex = 0` before each `.exec()` call to improve iteration performance.
