## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2024-06-01 - Missing Defense-in-Depth on High-Risk Endpoints
**Vulnerability:** Unauthenticated or insufficiently protected endpoints executing system commands (e.g., `execFile`).
**Learning:** Even if a global authentication middleware exists or the endpoint is seemingly obscured, high-risk endpoints must explicitly declare and apply their required authentication/authorization middleware at the route level to ensure defense-in-depth and prevent accidental exposure if global middleware is bypassed or refactored.
**Prevention:** Always explicitly apply `authMiddleware` (or equivalent) to the route definition of any endpoint executing `exec`, `execFile`, or performing sensitive system operations, e.g., `app.post('/api/route', authMiddleware, ...)`

## 2025-05-18 - Prevent information leakage in shell command endpoints
**Vulnerability:** Raw `stdout` and `stderr` from shell commands (like `git add` and `git commit` via `execFile`) were being passed directly into HTTP 500 JSON responses.
**Learning:** Exposing raw command output or stack traces to clients is an Information Exposure vulnerability. It can leak sensitive internal paths, environment configurations, and stack details to end users.
**Prevention:** To prevent data leakage, always return generic error messages to the client (e.g., `res.status(500).json({ error: 'Git add failed' })`) and securely log the verbose details internally using the server logger (e.g., `logger.error(..., { stderr })`).
## 2025-02-24 - Cross-Site Scripting (XSS) via `marked` output
**Vulnerability:** Found un-sanitized parsed Markdown from `marked` being passed directly to React's `dangerouslySetInnerHTML` in `ChatBox.jsx`.
**Learning:** `marked` does not sanitize HTML by default since version 0.7.0, allowing malicious user-generated content (like scripts within markdown) to be executed by the browser.
**Prevention:** Always use a sanitization library like `DOMPurify` to clean the HTML string from `marked.parse` before inserting it into the DOM via `dangerouslySetInnerHTML`.
