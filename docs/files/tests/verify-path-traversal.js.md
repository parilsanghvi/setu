## Purpose
The \`verify-path-traversal.js\` test file specifically focuses on testing security controls preventing arbitrary file reads across endpoints, mainly in \`lib/server.js\`.

## Exports
- None.

## Dependencies
- Relies on \`node:test\` and the server module.

## Side Effects
- Fires requests containing malicious path segments (like \`../\`) to verify that the server properly sanitizes paths and returns a \`403 Forbidden\` or \`400 Bad Request\`.
