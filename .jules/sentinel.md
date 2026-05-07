## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2025-05-07 - Sanitize Markdown Parsed Output in React
**Vulnerability:** Found `dangerouslySetInnerHTML` directly rendering the output of `marked.parse` without sanitization in `frontend/app/src/components/ChatBox.jsx`.
**Learning:** `marked.parse` converts markdown to HTML but does not sanitize it, leaving the application open to Cross-Site Scripting (XSS) if malicious content is parsed and injected via `dangerouslySetInnerHTML`.
**Prevention:** Always sanitize the output of markdown parsing libraries (e.g., using `DOMPurify.sanitize()`) before passing it to `dangerouslySetInnerHTML`.
