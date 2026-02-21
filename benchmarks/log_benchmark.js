const fs = require('fs');
const path = require('path');

const LOG_FILE_SYNC = path.join(__dirname, 'bench_sync.log');
const LOG_FILE_STREAM = path.join(__dirname, 'bench_stream.log');

const ITERATIONS = 10000;
const MSG = 'This is a test log message to measure performance of sync vs async logging.';

// Helper to remove files
function cleanup() {
  if (fs.existsSync(LOG_FILE_SYNC)) fs.unlinkSync(LOG_FILE_SYNC);
  if (fs.existsSync(LOG_FILE_STREAM)) fs.unlinkSync(LOG_FILE_STREAM);
}

// Ensure cleanup before start
cleanup();

function logSync() {
  const logMsg = `[SUTRADHAR] ${MSG}`;
  try {
    fs.appendFileSync(LOG_FILE_SYNC, logMsg + '\n');
  } catch (e) { }
}

async function runBenchmark() {
  console.log(`Running benchmark with ${ITERATIONS} iterations...`);

  // 1. Sync Logging (Current Implementation)
  const startSync = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    logSync();
  }
  const endSync = process.hrtime.bigint();
  const timeSync = Number(endSync - startSync) / 1e6; // ms
  console.log(`Sync Logging Time: ${timeSync.toFixed(2)} ms`);

  // 2. Stream Logging (Proposed Implementation)
  const logStream = fs.createWriteStream(LOG_FILE_STREAM, { flags: 'a' });

  // Wait for 'open' event to be sure file exists? Not strictly necessary for benchmark timing of 'write'.

  const startStream = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    const logMsg = `[SUTRADHAR] ${MSG}`;
    logStream.write(logMsg + '\n');
  }
  const endStream = process.hrtime.bigint();
  const timeStream = Number(endStream - startStream) / 1e6; // ms
  console.log(`Stream Logging Time (Main Thread Block): ${timeStream.toFixed(2)} ms`);

  logStream.end(() => {
    // Cleanup after stream is closed
    cleanup();
    console.log(`Improvement: ${(timeSync / timeStream).toFixed(2)}x faster (on main thread)`);
  });
}

runBenchmark();
