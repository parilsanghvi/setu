---
source_hash: d816554f2da8eb03
facts_hash: 2c8c306b2b43b0f8
generated_at: 2026-03-03T07:14:18.216Z
generator_version: 1.0.0
model: cheap
quality_score: 81
---
# File: lib/AgentToolExecutor.js

## Purpose
The lib/AgentToolExecutor.js file defines a class, AgentToolExecutor, which handles the execution of tools for CoreAgent instances, including built-in file tools and dynamically loaded skills.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `executeTool` | function | Executes a specific tool according to its defined schema and handler. |
| `_resolvePath` | function | Resolves a path against the agent's scope and ensures it is contained within. |

## Internal Logic
The main execution flow of AgentToolExecutor involves:
- The `executeTool` method, which takes a tool call object as input.
- Schemas validation (if defined) for the tool call arguments using zod.
- Execution of dynamic tool code from skills or delegated internal methods.
- Handling default common tools like read_file and write_file.

The constructor initializes the AgentToolExecutor instance with a reference to the CoreAgent instance.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities. |
| `path` | No | Provides path manipulation functions. |
| `zod` | No | Offers schema validation and type checking capabilities. |

## Side Effects

## Dependents
- [CoreAgent.js](./CoreAgent.js.md)

## Cross-References
- [CoreAgent.js](./CoreAgent.js.md)
