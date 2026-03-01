---
source_hash: b44d0d2dd60cac0c
facts_hash: 297ab841c3609db4
generated_at: 2026-02-25T12:25:25.094Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/test-intern-gate.js

## Purpose
This file tests the Intern Approval Protocol by simulating an intern proposing a risky task and verifying that the human gate is triggered correctly.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Intern` | class | - | Represents an intern agent, responsible for proposing tasks and receiving feedback. |
| `BackendLead` | class | - | Represents a backend lead agent, responsible for reviewing and approving proposals. |
| `bus` | object | - | Provides a database interface to store and retrieve messages. |
| `LLM` | function | system, messages | Generates escalation messages based on input prompts. |
| `fs` | module | - | Provides file system operations. |
| `path` | module | - | Provides path manipulation utilities. |

## Internal Logic
The testInternGate function simulates the following flow:

1.  It creates an intern and a backend lead, and sets up a temporary scope for the intern's tasks.
2.  It proposes a risky task to the backend lead through the handleInternProposal method.
3.  It checks if an escalation message exists in the database by querying the messages table.
4.  If an escalation message is found, it logs a success message; otherwise, it logs an error message.

Key functions involved:

*   `testInternGate`: The main test function that orchestrates the simulation of the intern's proposal and the backend lead's response.
*   `handleInternProposal`: The method on the BackendLead class that receives and processes proposals from interns.
*   `prepare`: A query method on the bus object that prepares a SQL statement to retrieve messages from the database.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Shishya` | Yes | Implements the Shishya agent, which is used by the intern. |
| `../agents/Tark` | Yes | Implements the Tark agent, which is used by the backend lead. |
| `../lib/db` | Yes | Provides a database interface to store and retrieve messages. |
| `../lib/LLM` | Yes | Generates escalation messages based on input prompts. |

## Side Effects
*   console_output: The test outputs log messages to the console, indicating the progress of the simulation.
*   database: The test interacts with the database by querying the messages table and storing proposals in it.
*   filesystem_read: The test reads files from the file system to simulate the proposal task, including creating a PLAN.md file for the risky task.
*   filesystem_write: The test writes files to the file system, including creating the PLAN.md file.
*   process_control: The test exits the process with a status code of 0 after completing the simulation.

## Dependents
No known dependents.

## Cross-References
- [Shishya.js](../agents/Shishya.js.md)
- [Tark.js](../agents/Tark.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
