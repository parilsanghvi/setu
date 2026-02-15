---
name: drishti
description: Scans the codebase for patterns, files, and dependencies. Use when asked to "scan", "find", "search", or "analyze" code.
tags: general
---
# Drishti (The Scanner) 👁️

Drishti provides deep visibility into the codebase.

## Capabilities

### 1. `scan_files`
List files in a directory to understand structure.
```bash
find . -maxdepth 2 -not -path '*/.*'
```

### 2. `grep_code`
Search for a pattern in the codebase.
```bash
grep -rn "search_term" .
```

### 3. `list_dependencies`
View project dependencies.
```bash
cat package.json
```
