
const io = require('socket.io-client');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const db = require('../lib/db'); // Use lib/db directly to manipulate state

// Kill any existing process on 3000
try {
  require('child_process').execSync('kill $(lsof -t -i :3000) 2>/dev/null || true');
} catch (e) { }

const DASHBOARD_PASS = 'testpass';
console.log('🚀 Starting System Kernel (index.js)...');
const kernel = spawn('node', ['index.js'], {
  stdio: 'pipe',
  env: { ...process.env, LOG_LEVEL: 'silent', DASHBOARD_PASS }
});

// Manipulate DB to force updates
let status = 'IDLE';
setInterval(() => {
  // Toggle status to force an update (heartbeat-only updates are now optimized away)
  status = status === 'IDLE' ? 'BUSY' : 'IDLE';
  // This would trigger an update every 500ms if NO throttling existed.
  // With throttling (2000ms), we should see updates every 2000ms.
  db.heartbeat('Tark', 'Tark', 1234, status);
}, 600);

setTimeout(() => {
  console.log('🔌 Connecting to Kernel...');
  const auth = Buffer.from(`admin:${DASHBOARD_PASS}`).toString('base64');
  const socket = io('http://localhost:3000', {
    extraHeaders: {
      Authorization: `Basic ${auth}`
    }
  });

  let updates = [];
  const MAX_UPDATES = 5;

  socket.on('connect', () => {
    console.log('✅ Connected');
  });

  socket.on('agents_update', (data) => {
    const now = Date.now();
    console.log(`📡 agents_update received at ${now} (${data.length} agents)`);
    updates.push(now);

    if (updates.length >= MAX_UPDATES) {
      // We have enough data points.
      analyzeUpdates();
    }
  });

  function analyzeUpdates() {
    console.log('📊 Analyzing Broadcast Frequency...');
    let intervals = [];
    for (let i = 2; i < updates.length; i++) {
      const diff = updates[i] - updates[i - 1];
      intervals.push(diff);
      console.log(`   Interval ${i}: ${diff}ms`);
    }

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    console.log(`   Average Interval: ${Math.round(avg)}ms`);

    // Expected: ~2000ms.
    // If < 1500, it means throttling failed (running at 1000ms or 500ms).
    if (avg > 1500) {
      console.log('✅ PASS: Interval is throttled correctly (> 1500ms).');
      cleanup(0);
    } else {
      console.error('❌ FAIL: Interval is too frequent (likely 1000ms). Optimization failed.');
      cleanup(1);
    }
  }

  function cleanup(code) {
    socket.disconnect();
    kernel.kill();
    process.exit(code);
  }

  setTimeout(() => {
    console.error('❌ FAIL: Timeout waiting for updates.');
    cleanup(1);
  }, 10000);

}, 2000);
