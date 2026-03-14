## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.
## 2026-03-14 - Limit express.json() payload size
**Vulnerability:** Found uses of express.json() without a payload size limit.
**Learning:** express.json() parses the full body into memory. Without a limit, an attacker can send extremely large JSON payloads, exhausting server memory and CPU resources (DoS).
**Prevention:** Always configure express.json() with a reasonable limit (e.g., { limit: '100kb' }).
