---
source_hash: c726091ccdf5cce9
facts_hash: 4c4fcef19a8c496a
generated_at: 2026-03-04T06:14:01.468Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/verify-proto-pollution.js

## Purpose
This file verifies the prototype pollution safety of two objects, `RUNNING_PROCESSES` and `SPAWN_TIMES`, by simulating an attack on their prototype chains and asserting that the expected results are returned.

## Exports / API Surface
| Module | Description |
|--------|-------------|
| assert  | Asserts the correctness of conditions. |
| console | Logs messages to the console for testing purposes. |

## Internal Logic
The main execution flow consists of two parts:
1. The file creates a new object `RUNNING_PROCESSES` with correct initialization using `Object.create(null)`.
2. It simulates an attack on the prototype chain of `RUNNING_PROCESSES` by accessing the property `__proto__`. This is done to verify that the expected result (`undefined`) is returned.
3. The file also checks the safety of another object, `SPAWN_TIMES`, using a similar approach.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Verifies conditions for safe prototype access. |

## Side Effects
- console_output: The file logs messages to the console during execution, including test results and error messages.
- process_control: The file uses `process.exit(1)` to control the process termination if a test fails.

## Dependents
No known dependents.

## Cross-References
No cross-references.
