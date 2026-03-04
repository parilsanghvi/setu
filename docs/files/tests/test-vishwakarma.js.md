---
source_hash: a873578c7bb40231
facts_hash: 570bc36f1e8c1ce3
generated_at: 2026-03-04T06:09:57.393Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-vishwakarma.js

## Purpose
This file contains a test suite for the Vishwakarma agent, which is responsible for evaluating and approving infrastructure specifications. The test suite exercises the agent's veto and approval logic on both safe and unsafe specifications, as well as its ability to audit files for compliance with security best practices.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Vishwakarma` | constructor | `name, identifier` | Initializes a new Vishwakarma agent instance. |
| `handleSpecProposal` | method | `agent, proposal` | Handles a proposed specification and updates the contract status accordingly. |
| `auditInfraFile` | method | `agent, filePath, role` | Audits an infrastructure file for compliance with security best practices. |

## Internal Logic

The test suite consists of three main tests:

1.  The first test exercises the agent's veto logic by proposing a bad specification that violates the isolation principle and checking if the agent correctly vetoes it.
2.  The second test exercises the agent's approval logic by proposing a good specification and checking if the agent correctly approves it.
3.  The third test audits an infrastructure file for compliance with security best practices and checks if the agent correctly identifies issues.

The key functions in this file are:

*   `testVishwakarma`: The main test function that runs all three tests.
*   `handleSpecProposal`: Handles a proposed specification and updates the contract status accordingly.
*   `auditInfraFile`: Audits an infrastructure file for compliance with security best practices.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `Vishwakarma` | Yes | Provides the Vishwakarma agent class. |
| `Contractor` | Yes | Provides helper functions for issuing specifications and getting contract status. |
| `LLM` | Yes | Provides a mock LLM generator that simulates approval decisions. |
| `fs` | No | Provides file system utilities, but is not used directly in this test suite. |
| `path` | No | Provides path manipulation utilities, but is not used directly in this test suite. |

## Side Effects

*   console_output: The test suite logs output to the console for each test step.
*   filesystem_write: The test suite writes a temporary file to disk during the third test.
*   process_control: The test suite exits the process after completing all three tests.

## Dependents
No known dependents.

## Cross-References
- [Vishwakarma.js](../agents/Vishwakarma.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [LLM.js](../lib/LLM.js.md)
