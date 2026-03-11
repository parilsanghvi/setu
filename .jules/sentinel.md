## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2026-03-11 - Enforce Payload Size Limits
**Vulnerability:** Express apps lacked JSON payload size limits via `express.json()`, making them vulnerable to DoS.
**Learning:** `express.json()` without a limit can be exploited by an attacker submitting a massive JSON payload to exhaust server resources. The setup was duplicated across three different locations (`index.js`, `lib/routes.js`, `lib/routes/api.js`).
**Prevention:** Ensure `express.json({ limit: '<size>' })` configuration is globally unified, and explicitly cap payload sizes on endpoints receiving external payloads to adhere to security best practices.
