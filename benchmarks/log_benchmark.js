const fs = require('fs');
const path = require('path');

const ITERATIONS = 10000;
const LOG_MSG = '[BENCHMARK] This is a test log message to measure performance.';
const SYNC_FILE = path.join(__dirname, 'bench_sync.log');
const ASYNC_FILE = path.join(__dirname, 'bench_async.log');

// Clean up
if (fs.existsSync(SYNC_FILE)) fs.unlinkSync(SYNC_FILE);
if (fs.existsSync(ASYNC_FILE)) fs.unlinkSync(ASYNC_FILE);

console.time('fs.appendFileSync');
for (let i = 0; i < ITERATIONS; i++) {
  fs.appendFileSync(SYNC_FILE, LOG_MSG + '\n');
}
console.timeEnd('fs.appendFileSync');

console.time('fs.createWriteStream');
const stream = fs.createWriteStream(ASYNC_FILE, { flags: 'a' });
for (let i = 0; i < ITERATIONS; i++) {
    const ok = stream.write(LOG_MSG + '\n');
    if (!ok) {
        // Handle backpressure if needed, but for benchmark we just write
    }
}
stream.end(() => {
    console.timeEnd('fs.createWriteStream');
});
