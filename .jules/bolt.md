## 2025-03-02 - RegExp Compilation in Hot Loops
**Learning:** Instantiating `new RegExp(...)` inside inner loops (especially tight parsing loops traversing lines of files) introduces significant overhead in Node.js due to repeated compilation and garbage collection.
**Action:** When applying global regular expressions iteratively across file contents, reuse pre-compiled regex instances and explicitly reset `lastIndex = 0` before each `.exec()` call to bypass recompilation while maintaining correct state.
