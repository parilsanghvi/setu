# Verify: Path Traversal Security Checks

This script executes security checks against the `CoreAgent` module to ensure it prevents path traversal vulnerabilities.
It specifically verifies that `readFile` and `writeFile` operations cannot escape the predefined agent scope directory.
This prevents arbitrary access to the server's filesystem by isolating the agent.

## Validations
- **Scope Escaping:** Attempts to read/write using `../` patterns.
- **Absolute Paths:** Attempts to read/write using absolute path prefixes.
- **Sibling Directory Traversal:** Attempts to read/write to adjacent agent directories.
