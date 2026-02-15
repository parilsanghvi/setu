---
name: sudhar
description: Fixes bugs, applies patches, and refactors code. Use when asked to "fix", "patch", "rewrite", or "correct" code.
---
# Sudhar (The Fixer) 🔧

Sudhar applies changes to the codebase with surgical precision.

## Capabilities

### 1. `apply_patch`
Applies a unified diff or replaces file content.

**Usage:**
- Use standard file writing tools (e.g., `fs.writeFileSync`).
- **Constraint:** Always log the change to `JOURNAL.md` before applying.

### 2. `rewrite_file`
Completely replaces a file's content.

**Usage:**
```javascript
const fs = require('fs');
fs.writeFileSync('path/to/file.js', newContent);
```
