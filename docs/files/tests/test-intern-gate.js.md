---
source_hash: 1f738e17c7e006c3
facts_hash: 898673c371bfb9c0
generated_at: 2026-03-04T06:01:48.166Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-intern-gate.js

## Purpose
This file tests the Intern approval protocol, which involves an intern proposing a risky task and receiving escalation from a Backend Lead if the plan includes dropping the users table. The test creates mock data to simulate this scenario and verifies that the human gate is triggered successfully. It uses the `Intern` and `BackendLead` classes to interact with the system.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
|  | function | `req, res` | Handles incoming requests |
| `handleInternProposal` | method | `msgs.length > 0` | Escalates message to Sutradhar if proposal is risky enough |
| `testInternGate` | function | `` | Tests Intern approval protocol |

## Internal Logic
The main execution flow of this file creates a test environment, proposes a risky task, and checks for escalation. The key functions involved are:
- `testInternGate`: Tests the Intern approval protocol by proposing a risky task and verifying that the human gate is triggered.
- `handleInternProposal`: Handles the proposal from the intern, including checking if the plan is risky enough to require escalation.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
|  | Yes | Provides helper utilities for file system operations |
| `../agents/Shishya` | Yes | Implements the Intern class |
| `../agents/Tark` | Yes | Implements the BackendLead class |
| `../lib/db` | Yes | Provides a database connection for storing messages |
| `../lib/LLM` | Yes | Generates responses from the LLM |

## Side Effects
- console_output: The file logs various messages to the console, including test steps and results.
- database: The file writes a message to the database when an escalation is triggered.
- filesystem_read: The file reads files from the file system, including creating directories and writing plan files.
- filesystem_write: The file writes files to the file system, including creating a plan file with a risky task proposal.
- process_control: The file exits the test environment after completion.

## Dependents
No known dependents.

## Cross-References
- [Shishya.js](../agents/Shishya.js.md)
- [Tark.js](../agents/Tark.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
