# \`benchmarks/fs_read_benchmark.js\`

## Purpose
A benchmark script to measure the performance improvement of replacing `fs.readFileSync` with `fs.promises.readFile` inside an Express route handler. It specifically tests the raw execution time and I/O blocking behavior to justify the optimization made in the main codebase.

## Dependencies
* \`fs\`: For filesystem operations.
* \`path\`: For resolving file paths.

## Known Issues
* None

## To Do
* None
