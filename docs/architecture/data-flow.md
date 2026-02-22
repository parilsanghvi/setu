# Data Flow

## A) User → System

User input can enter via:
- HTTP `POST /api/chat`
- Socket event `chat_message`

Both paths produce `bus.send(...)` entries in `messages` table.

## B) Kernel Poll Loop

Every ~1 second (`startSystemLoops` in `index.js`):
1. Pull new messages since `lastMessageId`.
2. Emit `chat_message` to UI.
3. Notify recipient agent process via IPC (`proc.send({ type: 'new_message' })`).

## C) Agent Execution Loop

In `CoreAgent`:
1. Receive message.
2. Add to context.
3. Call LLM (with tools).
4. Execute tools if requested.
5. Send response/status back to bus.

## D) Tasks / Agent state

- Task writes go to `tasks` table (`updateTask`).
- Agent heartbeats go to `agents` table (`heartbeat`).
- Kernel rebroadcasts changed snapshots to dashboard sockets.

## E) Logs

- Kernel writes to `setu.log`.
- Child stdout/stderr is prefixed and forwarded into kernel log stream.
- UI receives `log` + `log_history` socket events.
