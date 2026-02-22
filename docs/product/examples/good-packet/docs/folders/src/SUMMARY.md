# Source (`src/`) Subsystem Summary

## Scope and Purpose
The `src/` directory houses the domain-driven backend controllers that implement core business logic for agent lifecycle handling. It serves as the bridge between raw `lib/` utilities and actual stateful execution endpoints mapped by `bin/setu`.

## Ownership
- **Primary Codeowners:** `@alice`, `@bob`

## Key Sub-directories
- `src/agents/`: State machines and context window allocators specific to LLM worker execution limits.
- `src/telemetry/`: Stream parsers formatting socket payloads identically for CLI (`bin/dashboard.js`) and UI ingestion.

## Invariants
- Code inside `src/` must not import React or HTML components globally.
- Error codes emitted from controllers here must subclass `BaseSetuError`.
