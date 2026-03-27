## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-01-01 - Avoid command injection in dynamically loaded skills
**Vulnerability:** Command injection vulnerability identified in `skills/drishti-v2/tools.js` where user input (`pattern` and `dir`) was directly interpolated into an unescaped string executed via `exec()`.
**Learning:** Dynamically loaded agent skills can also be vulnerable to classic shell injection vulnerabilities when attempting to interface with the operating system (e.g. running `findstr` or `dir`). Even when a codebase uses `execFile` securely in its core, dynamically loaded modules and plugins must also be validated for such vulnerabilities.
**Prevention:** Rather than trying to escape shell commands perfectly, always prioritize using Node.js's native cross-platform APIs (like `fs.promises.readdir` and `fs.promises.readFile`) instead of `exec()` or `execSync()` when interacting with the file system.
