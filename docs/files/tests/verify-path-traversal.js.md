---
source_hash: d4e4ba4641450050
facts_hash: f1d0712d8a54fe20
generated_at: 2026-03-04T06:13:53.094Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/verify-path-traversal.js

## Purpose
This file tests the security features of the CoreAgent class, specifically its ability to prevent path traversal attacks. The test creates a temporary directory for the agent scope and attempts to read files using both absolute and relative paths, verifying that the agent correctly denies access to files outside its scope.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `CoreAgent` | function | `name, role, dir` | Creates a new instance of the CoreAgent class. |
| `readFile` | method | `{ path: string }` | Reads the contents of a file using the provided path. |

## Internal Logic
The test begins by setting up a temporary directory for the agent scope and creating a file outside this scope. It then creates an instance of the CoreAgent class with limited scope and attempts to read the outside file using both absolute and relative paths.

1. `test('Security: CoreAgent Path Traversal Prevention', async (t) => { ... })`: The main test function, which sets up the test environment and runs the test.
2. `const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-scope-'));`: Creates a temporary directory for the agent scope.
3. `fs.writeFileSync(outsideFile, 'SECRET_DATA');`: Writes secret data to a file outside the agent's scope.
4. `const agent = new CoreAgent('TestAgent', 'Intern', tempDir);`: Creates a new instance of the CoreAgent class with limited scope.
5. `try { ... } finally { ... }`: The test execution block, which attempts to read files using both absolute and relative paths, and then cleans up after itself.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the CoreAgent class for testing. |
| `node:assert` | No | Provides assertion utilities for testing. |

## Side Effects
- `fs.mkdtempSync`: Creates a temporary directory and returns its path.
- `fs.writeFileSync`: Writes data to a file synchronously.
- `fs.rmSync`: Removes a file or directory recursively, returning the number of files removed.
- `fs.unlinkSync`: Deletes a file, returning immediately if it is a socket.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
