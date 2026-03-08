---
title: "Dependency Engine Module"
description: "Documentation for the lib/onboarding/dependency-engine.js file."
---

## Purpose
The dependency engine is responsible for computing module dependency graphs across the application. It parses Javascript files to detect requires and imports to construct an interconnected node graph. This is primarily used by the onboarding routines to determine impact areas and coverage.

## Exports
- `computeDependencies`: A function that scans a given directory and its files to compute internal and external module dependencies.
- `getDependencyGraph`: Retrieves the cached module dependency graph.

## Dependencies
- `fs`: Native file system module for reading file contents.
- `path`: Native path module for resolving file and directory paths correctly.
- `esprima`: Used optionally for advanced abstract syntax tree parsing if regex is insufficient.

## Side Effects
Reads files synchronously from the file system, which may block the event loop for extremely large directories. Caches the graph in memory to optimize subsequent reads.
