const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_FILE = path.join(__dirname, 'test_express_benchmark.jsonl');

// Generate test data
const iterations = 50000;
let fileContent = '';
for (let i = 0; i < iterations; i++) {
  fileContent += JSON.stringify({ index: i, text: 'This is a test line for benchmarking fs.readFileSync vs fs.promises.readFile.' }) + '\n';
}
fs.writeFileSync(TEST_FILE, fileContent);

const app = express();

app.get('/sync', async (req, res) => {
  try {
    const content = await fs.promises.readFile(TEST_FILE, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const data = lines.map(l => {
      try { return JSON.parse(l); } catch(e) { return null; }
    });
    res.json({ count: data.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/async', async (req, res) => {
  const content = await fs.promises.readFile(TEST_FILE, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  const data = lines.map(l => {
    try { return JSON.parse(l); } catch(e) { return null; }
  });
  res.json({ count: data.length });
});

app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server listening on port ${port}`);

  async function makeRequest(path) {
    return new Promise((resolve) => {
      http.get(`http://localhost:${port}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
    });
  }

  // Baseline: Sync
  const startSyncBlock = process.hrtime.bigint();
  const [syncRes, syncPing] = await Promise.all([
    makeRequest('/sync'),
    makeRequest('/ping') // This ping will be blocked by the sync read
  ]);
  const endSyncBlock = process.hrtime.bigint();
  console.log(`Time with Sync Block: ${(Number(endSyncBlock - startSyncBlock) / 1e6).toFixed(2)} ms`);

  // Optimized: Async
  const startAsyncBlock = process.hrtime.bigint();
  const [asyncRes, asyncPing] = await Promise.all([
    makeRequest('/async'),
    makeRequest('/ping') // This ping should respond immediately while the async read is pending
  ]);
  const endAsyncBlock = process.hrtime.bigint();
  console.log(`Time with Async Non-Block: ${(Number(endAsyncBlock - startAsyncBlock) / 1e6).toFixed(2)} ms`);

  fs.unlinkSync(TEST_FILE);
  server.close();
});
