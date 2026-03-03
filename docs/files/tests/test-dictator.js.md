---
source_hash: 0d1327ece40a8ed7
facts_hash: 428cf2f33c220614
generated_at: 2026-03-03T07:39:34.040Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-dictator.js

## Purpose
This file tests the functionality of the `BackendLead` class, specifically its veto power in evaluating and approving or rejecting specifications. It also tests the 3-Strike Escalation mechanism for blocked tasks.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| testDictator | function | `` | Runs the test suite for the `BackendLead` class and its veto power. |
| issueSpec | method | `taskId, content, meta` | Issues a specification with the given content and metadata. |
| getSpec | method | `taskId` | Retrieves the status of a specification with the given task ID. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `testDictator` function initializes the test environment by creating a new instance of the `BackendLead` class and setting up a mock LLM to veto specifications.
2. It then issues a bad specification with console logs, which should be vetted by the `BackendLead`.
3. The `handleSpecProposal` method is called on the `backend` object, passing in the bad specification and metadata.
4. After the veto, the test checks if the specification was successfully recorded as vetoed.
5. Next, the 3-Strike Escalation mechanism is tested by updating the task status three times to "TODO" with no owner, which should escalate the task to a blocked state.
6. Finally, the test checks if the escalation triggered correctly and prints the final task status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/db` | Yes | Provides access to the database for storing and retrieving task metadata. |
| `../lib/Contractor` | Yes | Offers helper functions for issuing specifications and getting their status. |
| `../agents/Tark` | Yes | Defines the `BackendLead` class, which is tested in this file. |
| `../lib/LLM` | Yes | Provides a mock LLM that can veto specifications when given certain prompts. |

## Side Effects
- console_output: The test prints log messages to the console to indicate the progress of each step in the test.
- database: The test updates and retrieves task metadata from the database, including setting the status to "TODO" or "BLOCKED".
- process_control: The test exits the process after completing all steps.

## Dependents
No known dependents.

## Cross-References
- [Tark.js](../agents/Tark.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
