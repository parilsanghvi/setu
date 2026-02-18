const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const PORT = 3000;
const SESSION_FILE = path.join(__dirname, '../logs/sessions/large_session.jsonl');
const FILE_SIZE_MB = 20;

async function generateSessionFile() {
  if (fs.existsSync(SESSION_FILE)) {
    console.log('Session file already exists.');
    return;
  }
  console.log(`Generating ${FILE_SIZE_MB}MB session file...`);
  const stream = fs.createWriteStream(SESSION_FILE);
  // Create a JSON object string
  const jsonObject = JSON.stringify({ role: 'user', content: 'This is a test message to fill up space.' });
  const line = jsonObject + '\n';

  const targetSize = FILE_SIZE_MB * 1024 * 1024;
  let currentSize = 0;

  while (currentSize < targetSize) {
    if (!stream.write(line)) {
      await new Promise(resolve => stream.once('drain', resolve));
    }
    currentSize += Buffer.byteLength(line);
  }
  stream.end();
  console.log('Session file generated.');
}

function startServer() {
  console.log('Starting server...');
  const server = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore', // 'inherit' to debug
    env: { ...process.env, PORT, DISABLE_DASHBOARD_AUTH: 'true' }
  });
  return server;
}

async function waitForServer() {
  console.log('Waiting for server to be ready...');
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/api/stats`);
      if (res.ok) {
        console.log('Server is ready.');
        return;
      }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  throw new Error('Server failed to start');
}

async function runBenchmark() {
  await generateSessionFile();
  const server = startServer();

  try {
    await waitForServer();

    console.log('Starting concurrent requests...');

    const start = Date.now();

    // Request 1: The blocker (Large File)
    const p1 = fetch(`http://localhost:${PORT}/api/sessions/large_session.jsonl`)
      .then(async res => {
          if (!res.ok) throw new Error(`Large file fetch failed: ${res.status}`);
          await res.text(); // Consume body fully
      })
      .then(() => console.log(`[Large File] Download complete: ${Date.now() - start}ms`))
      .catch(e => console.error(`[Large File] Error: ${e.message}`));

    // Wait a tiny bit to ensure p1 hits the server first/concurrently
    await new Promise(r => setTimeout(r, 10));

    // Request 2: The victim (Stats)
    const startStats = Date.now();
    const p2 = fetch(`http://localhost:${PORT}/api/stats`)
      .then(async res => {
          if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
          await res.json();
      })
      .then(() => {
        const duration = Date.now() - startStats;
        console.log(`[Stats API] Response time: ${duration}ms`);
        return duration;
      })
      .catch(e => console.error(`[Stats API] Error: ${e.message}`));

    const [_, statsDuration] = await Promise.all([p1, p2]);

    console.log('Benchmark complete.');
    return statsDuration;

  } finally {
    server.kill();
  }
}

runBenchmark().catch(console.error);
