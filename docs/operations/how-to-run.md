# How to Run Setu

## Prerequisites
- Node.js installed
- dependencies installed at repo root
- `.env` configured (run setup wizard if missing)

## Standard Start

### Option 1: direct backend
```bash
npm start
```
Runs `node index.js` (kernel/API/socket).

### Option 2: full mission control
```bash
npm run ignite
```
Runs `scripts/ignite.js` which:
- launches frontend dev server (`frontend/app`)
- launches backend kernel
- sends initial command to Sutradhar after a short delay

## Useful endpoints
- `GET /api/stats`
- `GET /api/tasks`
- `GET /api/agents`
- `POST /api/tasks`
- `POST /api/chat`

## Runtime data location
- Main runtime DB: `~/.setu/setu.db`
- Session logs: `logs/sessions/*.jsonl`
- Kernel log: `setu.log`
