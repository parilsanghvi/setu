# docs/files/tests/verify-path-traversal.js.md
This file tests the path traversal protection mechanisms implemented in `CoreAgent`.
It attempts to read and write files outside the agent's safe scope using `..` and absolute paths to ensure the isolation correctly prevents unauthorized file system access.
