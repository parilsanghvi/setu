## Purpose
The purpose of \`test-logger.js\` is to verify the behavior and formatting of the internal \`Logger\` class, ensuring it correctly outputs info, warning, and error messages.

## Exports
- None. This is an executable test script.

## Dependencies
- Imports the native \`node:test\` library.
- Imports \`lib/Logger.js\` to test its methods.

## Side Effects
- It will temporarily write output to \`process.stdout\` or \`process.stderr\` during test assertions.
