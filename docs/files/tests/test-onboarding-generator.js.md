# File: tests/test-onboarding-generator.js

## Purpose
This file contains unit tests for `lib/onboarding/generator.js`. It verifies that the onboarding generator can correctly identify missing documentation files and generate templates for them, including both a dry-run mode and an actual file generation mode.

## Key Exports/Entrypoints
- None (This is a test file, it executes sequentially when run)

## Side Effects
- Creates a temporary directory for testing filesystem operations.
- Temporarily mocks `path.resolve` to override the `REPO_ROOT` constant in the tested module.
- Generates dummy markdown files within the temporary directory.
- Cleans up the temporary directory upon test completion.
