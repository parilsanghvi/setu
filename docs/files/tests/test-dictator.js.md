---
source_hash: 0d1327ece40a8ed7
facts_hash: 41e438935241a1bd
generated_at: 2026-02-25T12:23:23.458Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-dictator.js

## Purpose
This file tests the functionality of The Dictator Model, specifically its ability to veto a bad specification and escalate tasks when necessary.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `testDictator` | function | `` | Exports a test function for testing The Dictator Model. |
| contractor.issueSpec | method | `taskId, 'backend', badSpec` | Issues a specification with a given ID and owner, and content. |
| contractor.getSpec | method | `taskId` | Retrieves a specification by its ID. |

## Internal Logic
The main execution flow of this file is as follows:
- It defines a test function `testDictator` that tests the functionality of The Dictator Model.
- It creates a new BackendLead instance to evaluate a proposed specification.
- It issues a bad specification and passes it to the BackendLead for evaluation.
- If the specification is vetoed, it retrieves the updated specification and checks its status.
- It then simulates a 3-Strike Escalation by updating the task's status multiple times until it escalates.
- Finally, it prints the results of the test and exits the process.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides access to the database for storing and retrieving task data. |
| `../lib/Contractor` | Yes | Offers methods for issuing and getting specifications. |
| `../agents/Tark` | Yes | Imports a class that represents a BackendLead agent, which is used to evaluate specifications. |
| `../lib/LLM` | Yes | Integrates an LLM model to generate vetoes for specifications. |

## Side Effects
- console_output: The file prints various messages and results to the console during its execution.
- database: The file updates the task data in the database multiple times, leading to a final escalation of the task.
- process_control: The file uses the `process.exit(0)` function to control the process flow after completing the test.

## Dependents
No known dependents.

## Cross-References
- [Tark.js](../agents/Tark.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
