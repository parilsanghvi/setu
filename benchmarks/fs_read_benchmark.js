const fs = require('fs');
const path = require('path');

const TEST_FILE = path.join(__dirname, 'test_read_file.jsonl');

// Generate test data
const iterations = 10000;
let fileContent = '';
for (let i = 0; i < iterations; i++) {
  fileContent += JSON.stringify({ index: i, text: 'This is a test line for benchmarking fs.readFileSync vs fs.promises.readFile.' }) + '\n';
}
fs.writeFileSync(TEST_FILE, fileContent);

async function runBenchmark() {
  console.log('Running benchmark for fs reads...');

  // 1. Sync Read
  let startSync = process.hrtime.bigint();
  for (let i = 0; i < 50; i++) {
    const content = fs.readFileSync(TEST_FILE, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const data = lines.map(l => JSON.parse(l));
  }
  let endSync = process.hrtime.bigint();
  let timeSync = Number(endSync - startSync) / 1e6;
  console.log(`Sync Read Time: ${timeSync.toFixed(2)} ms`);

  // 2. Async Read
  let startAsync = process.hrtime.bigint();
  for (let i = 0; i < 50; i++) {
    const content = await fs.promises.readFile(TEST_FILE, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const data = lines.map(l => JSON.parse(l));
  }
  let endAsync = process.hrtime.bigint();
  let timeAsync = Number(endAsync - startAsync) / 1e6;
  console.log(`Async Read Time: ${timeAsync.toFixed(2)} ms`);

  fs.unlinkSync(TEST_FILE);
  console.log(`Note: Since fs.promises.readFile returns a promise, the main thread is unblocked during the I/O operation. While raw execution time might not be drastically different, it allows Express to handle other requests concurrently, vastly improving throughput under load.`);
}

runBenchmark();
