---
description: Verification tests for path traversal vulnerabilities in CoreAgent
---

# verify-path-traversal.js
Verifies that the CoreAgent effectively mitigates path traversal attacks by rejecting attempts to access files outside its defined sandbox directory.

## Purpose
This security test ensures that the `CoreAgent` module cannot be tricked into accessing, modifying, or deleting files outside its expected scope using `../` syntax or absolute paths.

## Key Components
- Defines a set of malicious path payloads such as `../../etc/passwd`.
- Attempts to call `readFile` and `writeFile` with these payloads.
- Asserts that these calls are consistently rejected with appropriate error boundaries.

## Important Notes
The `_resolvePath` method in `CoreAgent` relies on this test. If the underlying path validation changes, ensure that this test is fully executed and passes.
