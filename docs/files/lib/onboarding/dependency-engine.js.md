# dependency-engine.js

## Purpose
Analyzes code files to map out internal and external module dependencies.

## Exports
- `getDependencies(filePath, options)`: Analyzes a file and returns its dependencies.
- `buildDependencyGraph(dirPath, options)`: Scans a directory to build a full dependency graph.

## Dependencies
- `fs`: For reading file contents.
- `path`: For resolving module paths.

## Side Effects
- Reads files from the disk synchronously or asynchronously.
