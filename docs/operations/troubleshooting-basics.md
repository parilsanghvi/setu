# Troubleshooting Basics

## 1) Agents crashing/restarting
Check:
- `setu.log`
- `logs/sessions/*.jsonl`
- `/api/agents` status

Kernel has auto-resurrection (30s heartbeat timeout + grace period).

## 2) UI not updating
Check:
- backend running on configured host/port (`index.js` defaults 127.0.0.1:3000)
- frontend Vite dev server running
- socket auth + CORS origin allowlist

## 3) Tasks/messages look empty or inconsistent
Remember: active DB is `~/.setu/setu.db`.
Repo-local `setu.db` / `setu.sqlite` may be stale artifacts.

## 4) Auth failures
Validate `.env` and middleware expectations in:
- `lib/middleware/auth.js`
- `lib/middleware/socketAuth.js`
- `lib/auth/*`

## 5) High CPU / noisy loops
Kernel loop runs every second and rebroadcasts state. Inspect:
- message volume in `messages`
- repeated agent crashes causing resurrection churn
