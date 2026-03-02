# File: lib/AgentToolExecutor.js

## Purpose
`AgentToolExecutor` is a helper class for `CoreAgent` that handles the execution of tools. It manages schema validation for tool arguments, executes dynamic skill tools, and implements core built-in tools like `read_file` and `write_file` while enforcing scope and security constraints.

## Exports
- `AgentToolExecutor` (Class): The main class for tool execution.

## Dependencies
- `fs`: Used for filesystem access and promises (`fs.promises`).
- `path`: Used for resolving and validating file paths.
- `zod`: Used for runtime schema validation of tool arguments.

## Side Effects
- Mutates the filesystem via `write_file` if authorized.
- Calls various internal and dynamic functions.
- Logs tool execution using the `CoreAgent`'s logger.
