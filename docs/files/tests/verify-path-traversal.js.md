---
title: Verify Path Traversal
description: Tests path traversal protections in CoreAgent.
---
# `verify-path-traversal.js`

This script verifies that the core agent is rigidly protected against path traversal (Directory Traversal) vulnerabilities. It tests the `_resolvePath` functionality by attempting to read or write files using malicious inputs, such as excessive `../` sequences, absolute paths, or attempts to access files outside the predefined safe workspace scope.

## Purpose

Path traversal is a critical vulnerability that could allow an agent (or a compromised LLM) to access sensitive host files like `/etc/passwd` or environment variables. This test ensures the isolation boundaries are strictly enforced and that the path resolution utility correctly normalizes and validates every file path before proceeding with file system operations.
