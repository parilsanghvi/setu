const Database = require('better-sqlite3');
const path = require('path');
const EventEmitter = require('events');

const dbPath = path.join(__dirname, '../setu.db');
const db = new Database(dbPath); // { verbose: console.log }

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize Schema (Idempotent)
db.exec(`
  -- MESSAGING (The Nervous System)
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,      -- "Narad", "Backend-Lead"
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
`);

// ⚡ The Event Bus Wrapper
class Bus extends EventEmitter {
  constructor() {
    super();
    this.db = db;
  }

  // Send a message & Emit Event
  send(sender, recipient, content, type = 'chat', meta = {}) {
    const stmt = this.db.prepare(`
      INSERT INTO messages (sender, recipient, type, content, meta) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(sender, recipient, type, content, JSON.stringify(meta));
    
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
    return this.db.prepare(`
      SELECT * FROM messages 
      WHERE (recipient = ? OR recipient = 'ALL') 
      AND read_at IS NULL
      ORDER BY created_at ASC
    `).all(recipient);
  }

  // Mark as Read
  markRead(ids) {
    if (ids.length === 0) return;
    const placeholder = ids.map(() => '?').join(',');
    this.db.prepare(`UPDATE messages SET read_at = (strftime('%s', 'now')) WHERE id IN (${placeholder})`).run(...ids);
  }

  // Agent Heartbeat
  heartbeat(name, role, pid, status = 'IDLE') {
    const stmt = this.db.prepare(`
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
    return this.db.prepare(`
      SELECT * FROM agents 
      WHERE (strftime('%s', 'now') - last_heartbeat) > ?
      AND status != 'OFFLINE'
    `).all(timeoutSeconds);
  }
}

module.exports = new Bus();
