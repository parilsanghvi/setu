---
source_hash: b44d0d2dd60cac0c
facts_hash: 5566f99e43e84d0e
generated_at: 2026-03-03T07:41:32.395Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-intern-gate.js

## Purpose
This file tests the Intern Approval Protocol, specifically the human gate mechanism, by simulating an intern proposing a risky task and checking if the escalation message is triggered successfully.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `testInternGate` | function | `` | Tests the Intern Approval Protocol |
|  |  |  |             |
|  |  |  |             |
|  |  |  |             |

## Internal Logic
The main execution flow of this file involves the following key functions:
- The `testInternGate` function: This is the main test function that orchestrates the simulation of an intern proposing a risky task and checks if the escalation message is triggered successfully.
  - It creates instances of the `BackendLead` and `Intern` agents, representing the backend lead and the intern, respectively.
  - It simulates the intern initiating a risky task by creating a plan file and sending it to the backend lead for review.
  - It checks if the escalation message is triggered in the database by querying the messages table.
- The `handleInternProposal` method: This method of the `BackendLead` agent handles the proposal sent by the intern, which includes the plan file and task details. It is not implemented in this test but would typically involve checking the proposal against certain criteria before escalating it to a human for review.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Shishya` | Yes | Provides a default implementation of an agent with basic functionality. |
| `../agents/Tark` | Yes | Provides a specific type of backend lead agent used in this test. |
| `../lib/db` | Yes | Supplies a database interface for interacting with the message table. |
| `../lib/LLM` | Yes | Offers a mock LLM implementation that can be overridden to simulate different response scenarios. |
| `fs` | No |  Provides file system utilities, including reading and writing files, which are used in this test for creating and deleting plan files. |
| `path` | No |  Supplies utility functions for working with file paths, including joining path components together. |

## Side Effects
- console_output: The `console.log` statements in the code output messages to the console during the execution of the test.
- database: The code queries the messages table in the database to check if an escalation message has been triggered and retrieve its content for output.
- filesystem_read: The code reads plan files from disk using `fs.readFileSync` and writes new plan files to disk using `fs.writeFileSync`.
- filesystem_write: The code creates a new directory and writes a new file to it when creating the plan file.
- process_control: The code exits the process after completing the test using `process.exit(0)`.

## Dependents
No known dependents.

## Cross-References
- [Shishya.js](../agents/Shishya.js.md)
- [Tark.js](../agents/Tark.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
