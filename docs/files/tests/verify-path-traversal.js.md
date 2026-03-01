---
description: "Verifies CoreAgent path traversal protections."
---

# `tests/verify-path-traversal.js`

This verification script is an automated security test that validates the `CoreAgent`'s path isolation and sandboxing mechanisms.

Specifically, it tests the `_resolvePath` utility function used internally by agents to ensure that:
- Agents are restricted from accessing files outside their assigned scope or working directory.
- The system correctly detects and prevents malicious path traversal attempts (e.g., trying to access `../../../../../etc/passwd` or similar relative paths moving upwards).
- Absolute path requests that resolve outside the agent's safe directory are safely rejected.

Passing this test confirms that the codebase correctly mitigates arbitrary file read/write vulnerabilities during automated agent operations.
