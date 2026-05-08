## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2025-05-24 - Fix missing route-level authentication for high-risk endpoints
**Vulnerability:** The `/api/git/commit` endpoint relied entirely on global `app.use(authMiddleware)` for protection, exposing it to auth bypass if the global middleware chain is ever misconfigured or bypassed.
**Learning:** High-risk endpoints (especially those executing shell commands or database modifications) need defense-in-depth. Relying solely on global middleware is brittle because a single misconfiguration higher up in the router can accidentally expose critical endpoints.
**Prevention:** Apply `authMiddleware` explicitly as a route-specific middleware (`app.post('/api/git/commit', authMiddleware, ...)`) for all high-risk endpoints.
