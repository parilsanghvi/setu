---
description: Tests to ensure file system path traversal constraints are respected
---

# verify-path-traversal.js

Verifies that agents cannot access files outside their designated workspace using path traversal techniques. Tests \`CoreAgent\` path isolation by asserting that \`readFile\` and \`writeFile\` reject paths escaping \`this.scope\` via \`..\`, absolute paths, or sibling directory traversal.

This is a critical security check to ensure that the AI agents running on the platform cannot read or write arbitrary files on the host system, keeping the execution environment secure.
