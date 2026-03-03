---
source_hash: 4d0e73b1a212ac0d
facts_hash: c29f913fbd95dd04
generated_at: 2026-03-03T07:50:02.934Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-vishwakarma.js

## Purpose
This file contains a test case for the `Vishwakarma` class, which is used to validate infrastructure specifications. It tests two scenarios: vetoing an unsafe specification and approving a safe one. The test also simulates a file audit to detect missing User instructions.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `testVishwakarma` | function | `` | Tests the Vishwakarma class with two scenarios. |
| `handleSpecProposal` | method | object | Handles a proposed specification and returns its status. |
| `issueSpec` | method | string, string, string | Issues a new specification and returns its ID. |
| `getSpec` | method | string | Retrieves a specification by its ID. |

## Internal Logic
The test case starts by creating an instance of the `Vishwakarma` class and logs some introductory messages. It then tests two scenarios: vetoing an unsafe specification and approving a safe one. In both cases, it issues a new specification using the `issueSpec` method and then passes it to the `handleSpecProposal` method for validation. The test checks if the validation returns the expected result (VETOED or APPROVED). Finally, it simulates a file audit using the `auditInfraFile` method to detect missing User instructions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Vishwakarma` | Yes | Provides the Vishwakarma class for testing. |
| `../lib/Contractor` | Yes | Offers utility methods for issuing and getting specifications. |
| `../lib/LLM` | Yes | Supplies a mock LLM that generates responses based on predefined prompts. |
| `fs` | No | Used for writing to the file system during the simulation. |
| `path` | No | Provides utilities for working with file paths during the simulation. |

## Side Effects
- console_output: The test case logs messages to the console using `console.log` and `console.error`.
- filesystem_write: The test writes a Dockerfile to a temporary file on the file system using `fs.writeFileSync`.

## Dependents
No known dependents.

## Cross-References
- [Vishwakarma.js](../agents/Vishwakarma.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [LLM.js](../lib/LLM.js.md)
