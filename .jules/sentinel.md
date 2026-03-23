## 2025-01-01 - Fix command injection with execFileSync
**Vulnerability:** Found uses of execSync with dynamic arguments.
**Learning:** execSync evaluates dynamic strings via the shell causing injection. execFileSync avoids shell and safely parses args array.
**Prevention:** Prefer execFile/execFileSync over exec/execSync.

## 2025-01-01 - Runtime Type Errors in Dynamic Placeholder Generation
**Vulnerability:** Missing input validation in `lib/db.js` where the `IN (...)` clause placeholders were generated using untrusted user input `ids`. If `ids` wasn't an array, it caused runtime `TypeError` crashes.
**Learning:** Even when using parameterized queries (`.run(...ids)`) to prevent SQL injection, using `ids.map(() => '?')` assumes `ids` is a valid array. If an attacker passes a string or object, it causes unhandled exceptions that crash the application.
**Prevention:** Always validate that inputs used to generate dynamic SQL placeholders are genuine arrays and filter the elements strictly for expected data types (e.g., `!isNaN(Number(id))` for numeric IDs) before constructing and executing the query.
