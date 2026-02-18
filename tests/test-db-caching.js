const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// Mock better-sqlite3 completely to avoid loading native bindings
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'better-sqlite3') {
    return class Database {
      constructor() {
        this.prepareCounts = {};
        this.pragma = () => {};
        this.exec = () => {};
      }
      prepare(sql) {
        // Normalize whitespace for consistent counting
        const normalizedSql = sql.trim().replace(/\s+/g, ' ');
        this.prepareCounts[normalizedSql] = (this.prepareCounts[normalizedSql] || 0) + 1;
        return {
          all: () => [],
          get: () => ({}),
          run: () => ({ lastInsertRowid: 1 })
        };
      }
    };
  }
  return originalRequire.apply(this, arguments);
};

// Clear cache to ensure we get a fresh module with our mock
delete require.cache[require.resolve('../lib/db')];
const bus = require('../lib/db');

test('Bus: Caches prepared statements', (t) => {
  // 1. Call getDeadAgents twice
  bus.getDeadAgents();
  bus.getDeadAgents();

  // 2. Call new methods twice
  bus.getAgents();
  bus.getAgents();

  bus.getTasks();
  bus.getTasks();

  bus.getTaskMeta();
  bus.getTaskMeta();

  bus.getNewMessages(0);
  bus.getNewMessages(1);

  const db = bus.db;
  const prepares = Object.keys(db.prepareCounts);

  // Check counts
  const deadAgentQuery = prepares.find(q => q.includes('FROM agents') && q.includes('last_heartbeat'));
  assert.strictEqual(db.prepareCounts[deadAgentQuery], 1, 'getDeadAgents should be cached');

  const getAgentsQuery = prepares.find(q => q.includes('FROM agents ORDER BY name'));
  assert.strictEqual(db.prepareCounts[getAgentsQuery], 1, 'getAgents should be cached');

  const getTasksQuery = prepares.find(q => q.includes('SELECT * FROM tasks') && !q.includes('MAX'));
  assert.strictEqual(db.prepareCounts[getTasksQuery], 1, 'getTasks should be cached');

  const getTaskMetaQuery = prepares.find(q => q.includes('MAX(updated_at)'));
  assert.strictEqual(db.prepareCounts[getTaskMetaQuery], 1, 'getTaskMeta should be cached');

  const getNewMessagesQuery = prepares.find(q => q.includes('FROM messages WHERE id > ?'));
  assert.strictEqual(db.prepareCounts[getNewMessagesQuery], 1, 'getNewMessages should be cached');
});
