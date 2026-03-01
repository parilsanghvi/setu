---
title: Path Traversal Security Verification
description: Security audit script designed to confirm that the agent's file system interaction methods strictly enforce directory boundaries and are not vulnerable to path traversal or symbolic link escape techniques.
---

# Path Traversal Security Verification

The `verify-path-traversal.js` script is a critical security test that actively attempts to exploit potential directory traversal vulnerabilities within the CoreAgent's file handling logic.

It validates the path isolation sandboxing by simulating malicious inputs, such as relative traversal patterns (`../`) and absolute paths, to ensure they cannot escape the designated agent scope. Additionally, it confirms that recent security patches correctly utilize realpath resolution to prevent attackers from using symbolic links as a vector to bypass the directory restrictions and access unauthorized host files.
