---
title: Verify Path Traversal
description: "Security test verifying prevention of directory traversal attacks."
---

# \`tests/verify-path-traversal.js\`

## Purpose
This test script confirms that the file access boundaries defined in \`lib/CoreAgent.js\` successfully block read/write operations outside the agent's assigned workspace.

## Tests
- Attempts to read/write using \`..\` or absolute paths traversing beyond the designated \`scope\` directory.
- Asserts that all such operations are explicitly rejected.

## Important Notes
- This is a critical security test preventing unauthorized system access via the LLM context.

## Exports
- None

## Dependencies
- None

## Side Effects
- None
