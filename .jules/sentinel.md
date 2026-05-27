## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2025-05-24 - Apply defense-in-depth to high-risk API endpoints
**Vulnerability:** Found that `/api/git/commit` route relied on global middleware for authentication, which could be bypassed or modified unintentionally.
**Learning:** High-risk endpoints (like those executing shell commands via `execFile`) need defense-in-depth measures. Applying middleware globally isn't enough; it should also be applied specifically at the route level to guarantee authentication checks.
**Prevention:** Always apply `authMiddleware` directly to route definitions for sensitive or high-risk endpoints (e.g., `app.post('/api/secure', authMiddleware, ...)`).
