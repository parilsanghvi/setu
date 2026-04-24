## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.
## 2024-05-24 - Missing Input Validation on Task API Endpoints
**Vulnerability:** The task update (`PUT /api/tasks/:id`) and delete (`DELETE /api/tasks/:id`) endpoints lacked input validation for the `id` path parameter and the `status` body parameter, enabling potentially unexpected task modifications or invalid state assignments.
**Learning:** This existed because while `id` validation was enforced on some GET endpoints (e.g. `/api/tasks/:id/screenshots`), it was overlooked on mutation endpoints, leaving them susceptible to malformed inputs.
**Prevention:** Ensure consistent schema validation across all API endpoints, not just read endpoints, using common validation logic (like regex format checks) and allowlists for restricted values like status fields.
