# File: lib/AgentContextManager.js

## Purpose
`AgentContextManager` is a helper class for `CoreAgent` that manages the conversational context (short-term memory). It provides methods for efficiently counting tokens and compacting the context history using LLM summarization when limits are reached.

## Exports
- `AgentContextManager` (Class): The main class for context management.

## Dependencies
- `./LLM`: Used to invoke LLMs for memory summarization/compaction.
- `./Config`: Provides the `contextCompactionThreshold`.

## Side Effects
- Modifies the associated `CoreAgent`'s `context` array when compaction occurs.
- Emits events on the `CoreAgent` (`context_compact_start`, `context_compact_end`).
- Logs compaction events using `CoreAgent.sessionLogger`.
