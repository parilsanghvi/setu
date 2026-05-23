## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-04-20 - Fix command injection with execFile
**Vulnerability:** Found uses of `exec` with dynamic inputs for `findstr` and `dir` in `skills/drishti-v2/tools.js`.
**Learning:** `exec` and `execSync` evaluate dynamic strings via the shell, creating a command injection vulnerability. Additionally, shell builtins like `dir` are better replaced with native Node.js functionality (`fs.promises`).
**Prevention:** Prefer `execFile` or `execFileSync` over `exec`/`execSync` and pass arguments as an array. Use native `fs.promises` for filesystem operations rather than shell commands.

## 2026-05-23 - Fix XSS in ChatBox.jsx
**Vulnerability:** Found use of `dangerouslySetInnerHTML` without sanitizing user input from parsed Markdown.
**Learning:** React components that render Markdown strings via `dangerouslySetInnerHTML` are vulnerable to XSS if the Markdown string contains malicious HTML and is not sanitized.
**Prevention:** Always use `DOMPurify.sanitize` to sanitize HTML before passing it to `dangerouslySetInnerHTML`.
