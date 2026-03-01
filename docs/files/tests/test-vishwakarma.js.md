---
source_hash: 4d0e73b1a212ac0d
facts_hash: 068e871b020474ae
generated_at: 2026-02-25T12:31:17.452Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: tests/test-vishwakarma.js

## Purpose
This file contains a test suite for the `Vishwakarma` class, which is responsible for proposing and auditing infrastructure specifications in a blockchain-based system.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `testVishwakarma` | function | `` | Tests the functionality of the Vishwakarma class. |

## Internal Logic
The main execution flow involves creating an instance of the `Vishwakarma` class, testing its veto and approval capabilities on proposed infrastructure specifications, and simulating a file audit to verify the class's auditing functionality.

Key functions:

- `handleSpecProposal`: Handles a proposed infrastructure specification and returns a status.
- `auditInfraFile`: Performs an audit of an infrastructure file to detect potential security vulnerabilities.
- `getSpec`: Retrieves a previously issued infrastructure specification.
- `issueSpec`: Issues a new infrastructure specification.
- The `Vishwakarma` constructor initializes the class instance with the provided agent name and description.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Vishwakarma` | Yes | Provides the Vishwakarma class implementation. |
| `../lib/Contractor` | Yes | Supplies functions for issuing and retrieving infrastructure specifications. |
| `../lib/LLM` | Yes | Offers a mock LLM (Legal Logic Module) to simulate legal checking. |

## Side Effects
- console_output: 
    - The script logs various test results, including passed tests and failed tests.
    - It displays specific messages for each test step.
- filesystem_write:
    - The script writes a temporary Dockerfile to the file system during testing.
- process_control: 
    - The script uses `process.exit(0)` to terminate the process after completing all tests.

## Dependents
No known dependents.

## Cross-References
- [Vishwakarma.js](../agents/Vishwakarma.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [LLM.js](../lib/LLM.js.md)
