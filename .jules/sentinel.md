## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.
## 2025-02-27 - [XSS via dangerouslySetInnerHTML in Markdown Parser]
**Vulnerability:** ChatBox component parsed user/agent messages via `marked` and directly injected the output using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Even though `marked` generates HTML from markdown, it does not inherently sanitize malicious `<script>` tags or inline event handlers embedded in the markdown input, making it susceptible to XSS.
**Prevention:** Always wrap `marked.parse` output or any untrusted HTML payload with a dedicated sanitizer like `DOMPurify.sanitize` before passing it to `dangerouslySetInnerHTML`.
