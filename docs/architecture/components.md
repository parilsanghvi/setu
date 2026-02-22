# Components

## 1) Kernel / Orchestrator (`index.js`)

Responsibilities:
- boot HTTP server + Socket.IO
- spawn and supervise agents using `child_process.fork`
- maintain process map (`RUNNING_PROCESSES`)
- run resurrection and message polling loops
- expose dashboard APIs (`/api/stats`, `/api/tasks`, `/api/agents`, `/api/chat`, etc.)
- stream logs to UI

## 2) Event Bus + State Store (`lib/db.js`)

Implements:
- `messages` table (chat/events/commands)
- `tasks` table (kanban-like state)
- `agents` table (heartbeat + presence)

Key behavior:
- WAL mode enabled
- prepared statement caching
- escalation to BLOCKED after repeated task failures

## 3) Agent Runtime (`lib/Agent.js`, `lib/CoreAgent.js`)

`CoreAgent` provides:
- tool-enabled LLM loop (turn-based)
- context memory + compaction
- protocol handling (`TASK_ASSIGN`, `TASK_ACK`, `TASK_COMPLETE`, `TASK_FAIL`)
- interrupt handling (`STOP`, `REDIRECT`)

## 4) Persona Agents (`agents/*.js`)

Main personas in active map:
- Sutradhar (orchestrator)
- Tark
- Shilpi
- Guru
- Shishya
- Koshpal
- Rakshak
- Vishwakarma

`AGENT_MAP` in `index.js` is source of truth for what is spawned.

## 5) Frontend Dashboard (`frontend/app`)

- React + Vite + socket.io-client
- consumes API + socket events for logs/tasks/agents/chat

## 6) CLI/Bootstrap Scripts

- `scripts/ignite.js` starts dashboard and kernel, then sends an activation command.
- `bin/*` contains setup/auth/dashboard helpers.
