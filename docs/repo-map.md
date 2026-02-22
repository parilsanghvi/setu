# Repo Map (Current)

## Core Runtime
- `index.js` — kernel, API, socket, spawn/resurrection loops
- `lib/` — shared runtime modules (DB, LLM, auth, protocols, utilities)
- `agents/` — persona agent implementations

## Frontend
- `frontend/app/` — React + Vite dashboard
- `frontend/dashboard/` — static dashboard/screenshot serving area

## Scripts & CLI
- `scripts/ignite.js` — launch frontend + backend and auto-kickstart
- `bin/` — CLI helpers (`setu`, setup/auth tooling)

## Skills
- `skills/*` — domain skills loaded by SkillLoader

## Tests
- `tests/` — broad runtime/auth/LLM/protocol/unit-ish test set

## Historical/Planning docs
- `README.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `COMMANDS.md`, `MANIFESTO.md`, `plans/`

## Runtime artifacts (expected)
- `setu.log`
- `logs/sessions/*.jsonl`
- `setu.pid`
- DB under `~/.setu/setu.db`
