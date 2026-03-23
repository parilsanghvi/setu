const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const os = require('os');

const dbDir = path.join(os.homedir(), '.setu');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'setu.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize Schema (Idempotent)
db.exec(`
  -- MESSAGING (The Nervous System)
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,      -- "Sutradhar", "Backend-Lead"
    recipient TEXT NOT NULL,   -- "ALL", "Frontend-Lead"
    type TEXT NOT NULL,        -- "chat", "command", "report", "heartbeat"
    content TEXT NOT NULL,
    meta TEXT,                 -- JSON: { "contextPath": "...", "taskId": "..." }
    read_at INTEGER,           -- NULL if unread
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  -- KANBAN (The State)
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,       -- "TASK-101"
    title TEXT NOT NULL,
    status TEXT NOT NULL,      -- "TODO", "IN_PROGRESS", "BLOCKED", "DONE"
    owner TEXT NOT NULL,
    assignee TEXT,
    meta TEXT,                 -- JSON: { "budget": 1.0, "attempts": 0 }
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  -- AGENT REGISTRY (Resurrection Protocol)
  CREATE TABLE IF NOT EXISTS agents (
    name TEXT PRIMARY KEY,
    role TEXT NOT NULL,        -- "BackendLead", "Intern"
    status TEXT NOT NULL,      -- "IDLE", "BUSY", "OFFLINE", "CRASHED"
    pid INTEGER,
    last_heartbeat INTEGER DEFAULT (strftime('%s', 'now'))
  );

  -- Index for Polling Loop Performance
  CREATE INDEX IF NOT EXISTS idx_agents_heartbeat ON agents(last_heartbeat);

  -- Index for Tasks Sorting
  CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);

  -- Index for Messaging
  CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient, read_at, created_at);
`);

// Ensure 'assignee' column exists (Migration for existing databases)
try {
  db.exec("ALTER TABLE tasks ADD COLUMN assignee TEXT;");
} catch (e) {
  // Column likely already exists
}

// ⚡ The Event Bus Wrapper
class Bus extends EventEmitter {
  constructor() {
    super();
    this.db = db;
    this.stmts = {}; // Cache for prepared statements
  }

  // Helper: Get Cached Statement
  _stmt(key, sql) {
    if (!this.stmts[key]) {
      this.stmts[key] = this.db.prepare(sql);
    }
    return this.stmts[key];
  }

  // Send a message & Emit Event
  send(sender, recipient, content, type = 'chat', meta = {}) {
    const stmt = this._stmt('send', `
      INSERT INTO messages (sender, recipient, type, content, meta) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(sender, recipient, type, content, JSON.stringify(meta));

    // 🔬 Trace Signal (In index.js context, we assume a global debug function exists if in kernel)
    // But since lib/db.js is shared, we use console.log if LOG_LEVEL=verbose
    if (process.env.LOG_LEVEL === 'verbose') {
      console.log(`[BUS] 📡 SIGNAL: ${sender} -> ${recipient} (${type})`);
    }

    // 🔔 Real-time Signal (The Hook)
    this.emit('message', {
      id: info.lastInsertRowid,
      sender,
      recipient,
      type,
      content,
      meta
    });

    return info.lastInsertRowid;
  }

  // Poll for unread (Startup/Recovery)
  getUnread(recipient) {
    if (recipient === 'ALL') {
      return this._stmt('getUnread_ALL', `
        SELECT * FROM messages
        WHERE recipient = 'ALL'
        AND read_at IS NULL
        ORDER BY created_at ASC
      `).all();
    }
    return this._stmt('getUnread_User', `
      SELECT * FROM messages WHERE recipient = ? AND read_at IS NULL
      UNION ALL
      SELECT * FROM messages WHERE recipient = 'ALL' AND read_at IS NULL
      ORDER BY created_at ASC
    `).all(recipient);
  }

  // Get Chat History
  getChatHistory(agent, other, limit = 10) {
    return this._stmt('getChatHistory', `
      SELECT * FROM messages 
      WHERE (sender = ? AND recipient = ?)
      OR (sender = ? AND recipient = ?)
      OR (recipient = 'ALL')
      ORDER BY created_at DESC
      LIMIT ?
    `).all(agent, other, other, agent, limit).reverse();
  }

  // Mark as Read
  markRead(ids) {
    if (!Array.isArray(ids)) return;
    const validIds = ids.filter(id => !isNaN(Number(id)));
    if (validIds.length === 0) return;
    const placeholder = validIds.map(() => '?').join(',');
    this.db.prepare(`UPDATE messages SET read_at = (strftime('%s', 'now')) WHERE id IN (${placeholder})`).run(...validIds);
  }

  // Agent Heartbeat
  heartbeat(name, role, pid, status = 'IDLE') {
    const stmt = this._stmt('heartbeat', `
      INSERT INTO agents (name, role, pid, status, last_heartbeat)
      VALUES (?, ?, ?, ?, (strftime('%s', 'now')))
      ON CONFLICT(name) DO UPDATE SET
        pid = excluded.pid,
        status = excluded.status,
        last_heartbeat = excluded.last_heartbeat
    `);
    stmt.run(name, role, pid, status);
  }

  // Get Dead Agents (Last heartbeat > 30s)
  getDeadAgents(timeoutSeconds = 30) {
    const cutoff = Math.floor(Date.now() / 1000) - timeoutSeconds;
    return this._stmt('getDeadAgents', `
      SELECT name, role FROM agents
      WHERE last_heartbeat < ?
    `).all(cutoff);
  }

  // Update Task & Emit Event
  updateTask(id, status, meta = {}) {
    const owner = meta.owner || 'Unknown';
    const title = meta.title || 'Unknown';
    const assignee = meta.assignee || null;

    // 1. Fetch current meta for attempts if versioning/patching
    const currentTask = this._stmt('getTaskMetaById', 'SELECT meta FROM tasks WHERE id = ?').get(id);
    let attempts = 0;
    let oldMeta = {};
    if (currentTask && currentTask.meta) {
      try {
        oldMeta = JSON.parse(currentTask.meta);
        attempts = oldMeta.attempts || 0;
      } catch (e) {
        console.error(`[DB] Failed to parse meta for task ${id}:`, e);
      }
    }

    // Increment attempts if status is failed/todo retry
    if (status === 'TODO' || status === 'FAILED') {
      attempts++;
    }

    // 2. Update DB
    const stmt = this._stmt('updateTask', `
      INSERT INTO tasks (id, title, status, owner, assignee, meta, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, (strftime('%s', 'now')))
      ON CONFLICT(id) DO UPDATE SET
        title = CASE WHEN excluded.title != 'Unknown' THEN excluded.title ELSE title END,
        status = excluded.status,
        owner = CASE WHEN excluded.owner != 'Unknown' THEN excluded.owner ELSE tasks.owner END,
        assignee = COALESCE(excluded.assignee, tasks.assignee),\n        meta = excluded.meta,
        updated_at = excluded.updated_at
    `);

    stmt.run(id, title, status, owner, assignee, JSON.stringify({ ...oldMeta, ...meta, attempts }));

    // 3. Broadcast Event (If DONE or ESCLATED)
    if (status === 'DONE') {
      this.send('System', 'ALL', `Task ${id} marked DONE`, 'event', {
        type: 'TASK_DONE',
        taskId: id,
        ...meta
      });
    }

    if (attempts >= 3 && status !== 'DONE') {
      console.warn(`[System] 🚨 ESCALATION: Task ${id} failed 3 times. Blocking.`);
      this._stmt('blockTask', "UPDATE tasks SET status = 'BLOCKED' WHERE id = ?").run(id);
      this.send('System', 'ALL', `🚨 SUDO REQUIRED! Task ${id} is stuck. 3 strikes and you're out.`, 'alert', {
        type: 'SUDO_REQUIRED',
        taskId: id
      });
    }
  }

  // Delete Task
  deleteTask(id) {
    const stmt = this._stmt('deleteTask', 'DELETE FROM tasks WHERE id = ?');
    stmt.run(id);

    // Broadcast event so UI removes it immediately
    this.send('System', 'ALL', `Task ${id} deleted`, 'event', {
      type: 'TASK_DELETED',
      taskId: id
    });
  }

  // --- Optimized Getters (Cached Statements) ---

  getAgents() {
    return this._stmt('getAgents', 'SELECT * FROM agents ORDER BY name').all();
  }

  getTasks() {
    return this._stmt('getTasks', 'SELECT * FROM tasks').all();
  }

  getTaskMeta() {
    return this._stmt('getTaskMeta', 'SELECT MAX(updated_at) as t, COUNT(*) as c FROM tasks').get();
  }

  getNewMessages(lastId) {
    return this._stmt('getNewMessages', 'SELECT * FROM messages WHERE id > ? ORDER BY id ASC').all(lastId);
  }
}

module.exports = new Bus();
