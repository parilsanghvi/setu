---
description: Tests for path traversal vulnerability prevention
module: tests
---

# `verify-path-traversal.js`

## Purpose
This file contains tests to ensure that `CoreAgent` properly isolates file system operations, explicitly rejecting path traversal attempts (like `../` or absolute paths) to ensure agents remain confined to their intended scope directories. This is an important security feature check.

## Exports
None. This is an executable verification script.

## Dependencies
This file depends on the `CoreAgent` module and internal utilities for file mocking and assertion.

## Side Effects
It attempts local file access using mocked environments and performs cleanup after checks.
