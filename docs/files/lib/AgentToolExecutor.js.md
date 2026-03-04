---
source_hash: d816554f2da8eb03
facts_hash: fa6f11fd750e7baa
generated_at: 2026-03-04T05:33:59.905Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/AgentToolExecutor.js

## Purpose
The AgentToolExecutor file defines a class responsible for executing tools for CoreAgent, including built-in file tools and dynamically loaded skills. It handles tool execution by validating schema and parameters, executing dynamic tools from skills, and delegating to internal methods. The class provides a standardized way of interacting with tools in the system.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `AgentToolExecutor` | cjs_default | Handles execution of tools for CoreAgent |

## Internal Logic
The main execution flow involves the `executeTool` method, which takes a tool call as input and executes the corresponding action. The key functions involved in this process are:
- `_resolvePath`: Resolves a path against the agent's scope to ensure it is contained within.
- `readFile` and `writeFile`: Handle file operations by resolving paths and reading/writing files securely.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities for handling file access. |
| `path` | No | Supplies path manipulation functions for resolving paths relative to the scope. |
| `zod` | No | Offers schema validation capabilities for ensuring tool parameters conform to expected formats. |

## Side Effects
None detected.

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
