## Purpose
This file contains logic to deterministically build a "starting context package" for a given task by resolving target files from a task description or explicit paths, walking the upstream and downstream dependency graph, and assembling the relevant documentation into a single markdown package. It operates strictly using rule-based parsing without any LLM involvement.

## Exports
- `resolveTargetFiles`
- `walkDependencies`
- `buildContextPackage`
- `buildContextJSON`
- `scanAllFiles`

## Dependencies
- `fs`
- `path`
- `./doc-facts` (`extractFacts`)
- `./dependency-engine` (`buildGlobalRegistry`, `resolveFileDependencies`, `computeImpactMap`)
- `./status` (`IGNORE_DIRS`, `TARGET_EXTS`)

## Side Effects
Reads the file system synchronously to fetch file stats, list directory contents, and read source/documentation content.
