## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2025-05-24 - Explicit Authentication on High-Risk Endpoints
**Vulnerability:** A high-risk endpoint (`/api/git/commit`) relied solely on global authentication middleware, leaving it vulnerable if the global middleware was bypassed or removed.
**Learning:** Explicitly applying authentication middleware directly to route definitions for high-risk endpoints (e.g., those executing commands or accessing the file system) provides necessary defense-in-depth.
**Prevention:** Always apply `authMiddleware` directly to route-specific definitions for critical operations, regardless of global middleware configurations.
