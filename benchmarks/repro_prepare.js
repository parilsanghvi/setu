const Database = require('better-sqlite3');
const db = new Database(':memory:');

db.exec(`
  CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
  INSERT INTO tasks (id, title, status) VALUES ('1', 'Task 1', 'TODO');
  INSERT INTO tasks (id, title, status) VALUES ('2', 'Task 2', 'DONE');
`);

const ITERATIONS = 100000;

console.time('prepare_in_loop');
for (let i = 0; i < ITERATIONS; i++) {
  const stmt = db.prepare('SELECT * FROM tasks WHERE status = ?');
  stmt.all('TODO');
}
console.timeEnd('prepare_in_loop');

const stmt = db.prepare('SELECT * FROM tasks WHERE status = ?');
console.time('prepare_once');
for (let i = 0; i < ITERATIONS; i++) {
  stmt.all('TODO');
}
console.timeEnd('prepare_once');
