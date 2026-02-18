
const fs = require('fs');
const path = require('path');
const { test } = require('node:test');
const assert = require('node:assert');

const logFile = path.join(__dirname, 'test_watch.log');
const POLL_INTERVAL = 500;

// Mock IO
const io = {
  events: [],
  emit: (event, data) => {
    io.events.push({ event, data });
  }
};

test('Log Watcher Logic with fs.watch', async (t) => {
  // Cleanup
  if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
  fs.writeFileSync(logFile, '');

  let lastSize = fs.statSync(logFile).size;
  let debounceTimer = null;
  let watcher;

  // The Logic to be tested (same as will be in index.js)
  const checkUpdates = () => {
      // console.log('Checking updates...');
      try {
        const stats = fs.statSync(logFile);
        if (stats.size > lastSize) {
            const stream = fs.createReadStream(logFile, { start: lastSize, end: stats.size });
            stream.on('data', (chunk) => {
                io.emit('log', chunk.toString());
            });
            lastSize = stats.size;
        } else if (stats.size < lastSize) {
            lastSize = stats.size;
        }
      } catch (e) {
          // File might be gone
      }
  };

  const watchLog = () => {
    try {
        watcher = fs.watch(logFile, (eventType) => {
            if (eventType === 'rename') {
               // In test we might not handle rename, or we can simply restart if file exists
               if (fs.existsSync(logFile)) {
                   watcher.close();
                   watchLog();
                   checkUpdates();
               }
            } else if (eventType === 'change') {
               if (!debounceTimer) {
                   debounceTimer = setTimeout(() => {
                       debounceTimer = null;
                       checkUpdates();
                   }, 100); // Using 100ms for test speed, will use 500 in prod
               }
            }
        });
    } catch (e) {}
  };

  watchLog();

  // Test Case 1: Write data
  fs.appendFileSync(logFile, 'Line 1\n');

  await new Promise(r => setTimeout(r, 200)); // Wait for debounce

  assert.strictEqual(io.events.length, 1);
  assert.strictEqual(io.events[0].data, 'Line 1\n');

  // Test Case 2: Write multiple times quickly
  fs.appendFileSync(logFile, 'Line 2\n');
  fs.appendFileSync(logFile, 'Line 3\n');

  await new Promise(r => setTimeout(r, 200));

  // Should have read remaining lines. Might be one chunk or two depending on stream.
  const data = io.events.slice(1).map(e => e.data).join('');
  assert.ok(data.includes('Line 2\nLine 3\n'));

  // Test Case 3: Idle
  const initialEvents = io.events.length;
  await new Promise(r => setTimeout(r, 200));
  assert.strictEqual(io.events.length, initialEvents);

  // Cleanup
  if (debounceTimer) clearTimeout(debounceTimer);
  watcher.close();
  fs.unlinkSync(logFile);
});
