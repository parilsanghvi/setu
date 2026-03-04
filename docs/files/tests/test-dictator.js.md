---
source_hash: a78b0307a4b10490
facts_hash: 2ab1df1e2f9cfcec
generated_at: 2026-03-04T05:59:44.314Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-dictator.js

## Purpose
This file contains a test case for the "Dictator Model" in the system, specifically testing how it handles vetoed spec proposals and escalates tasks based on strike rules.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `testDictator` | function | `` | Exports a test function to test the Dictator Model. |
| `contractor.issueSpec` | function | `taskId, backend, spec` | Issues a new spec proposal with the given task ID and backend instance. |
| `contractor.getSpec` | function | `taskId` | Retrieves the status of a spec proposal with the given task ID. |
| `bus.updateTask` | method | `taskId, status, data` | Updates the status of a task with the given task ID to a new status and optional data. |
| `LLM.generate` | function | `system, messages` | Mocks the behavior of an LLM system to veto spec proposals containing console logs. |

## Internal Logic
The test case follows this execution flow:

1. Creates a new BackendLead instance for testing.
2. Issues a bad spec proposal that includes console logs and gets vetoed by the LLM.
3. Tests the escalation of tasks based on strike rules:
   - Updates the task status to "TODO" three times with attempts 0, 1, and 2 respectively.
   - Checks if the task status escalates to "BLOCKED" after the third attempt.

The key functions in this test case are:

* `testDictator`: The main test function that sets up and runs the tests.
* `contractor.issueSpec`: Issues a new spec proposal with the given task ID and backend instance.
* `contractor.getSpec`: Retrieves the status of a spec proposal with the given task ID.
* `bus.updateTask`: Updates the status of a task with the given task ID to a new status and optional data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Contractor` | Yes | Provides functions for issuing and retrieving spec proposals. |
| `../agents/Tark` | Yes | Supplies the BackendLead class for testing. |
| `../lib/db` | Yes | Manages task data and provides an interface to update tasks. |
| `../lib/LLM` | Yes | Mocks the behavior of an LLM system to veto spec proposals. |

## Side Effects
- console_output: The test case logs messages to the console for debugging purposes.
- database: The test case updates the task status in the database and retrieves its latest state.
- process_control: The test case exits the process after completion, indicating successful testing.

## Dependents
No known dependents.

## Cross-References
- [Tark.js](../agents/Tark.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
