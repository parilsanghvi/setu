# File: lib/AgentToolExecutor.test.js

**Purpose:** Tests the `AgentToolExecutor` class, ensuring schema validation, dynamic tool execution, internal method execution, and built-in standard tools (like `read_file` and `write_file`) work as expected. Verifies proper access control for paths.

**Key Exports/Entrypoints:**
- N/A (Test file)

**Side Effects:**
- Creates a temporary `temp_test_scope` directory for file manipulation tests, which is removed after tests complete.
