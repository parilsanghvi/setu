# Architecture Overview

Setu is a **local multi-agent orchestration runtime** with:
- a Node.js kernel (`index.js`),
- a SQLite-backed event bus (`lib/db.js`),
- multiple forked agent processes (`agents/*.js`),
- an HTTP + Socket.IO API layer,
- and a Vite/React dashboard (`frontend/app`).

## Runtime Topology

1. `index.js` boots Express + Socket.IO.
2. It seeds/spawns the agent swarm (Sutradhar, Tark, Shilpi, Guru, Shishya, etc.).
3. Agents communicate through the DB-backed bus (`messages`, `tasks`, `agents` tables).
4. Kernel loop (1s interval) handles:
   - dead-agent resurrection,
   - task/agent state broadcasts,
   - new message fanout to agents + dashboard.

## Persistence

Important: runtime state is persisted under **`~/.setu/setu.db`** (home dir), not repo-local DB files.

## Security Controls (present)

- `helmet` headers
- CORS allowlist (`ALLOWED_ORIGINS`)
- HTTP auth middleware (`lib/middleware/auth`)
- Socket auth middleware (`lib/middleware/socketAuth`)
- path traversal checks on screenshot/session file APIs
- input length limits for chat/redirect APIs
