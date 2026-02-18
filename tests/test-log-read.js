const fs = require('fs');
const path = require('path');
const assert = require('assert');

const TEST_LOG_FILE = path.join(__dirname, 'test_setu.log');

async function getLogHistory(filePath) {
  try {
      const stats = await fs.promises.stat(filePath);
      const fileSize = stats.size;
      const bufferSize = 16 * 1024; // 16KB
      const start = Math.max(0, fileSize - bufferSize);
      const length = fileSize - start;

      if (length <= 0) return [];

      const fileHandle = await fs.promises.open(filePath, 'r');
      try {
          const buffer = Buffer.alloc(length);
          await fileHandle.read(buffer, 0, length, start);
          const content = buffer.toString('utf8');

          let lines = content.split('\n');
          // Drop potential partial line at start if we are reading tail
          if (start > 0) lines.shift();

          const logs = lines.filter(l => l.trim()).slice(-50);
          return logs;
      } finally {
          await fileHandle.close();
      }
  } catch (e) {
      return [];
  }
}

async function runTest() {
    console.log('Generating test log file...');
    // Generate 2000 lines.
    // Each line: "Line <number>: <random stuff>"
    // Make sure it exceeds 16KB.
    // 2000 lines * ~20 chars = 40KB.

    const lines = [];
    for (let i = 1; i <= 2000; i++) {
        lines.push(`Line ${i}: This is some log content to fill up space.`);
    }

    fs.writeFileSync(TEST_LOG_FILE, lines.join('\n') + '\n');

    console.log('Running optimized log reader...');
    const result = await getLogHistory(TEST_LOG_FILE);

    console.log(`Got ${result.length} lines.`);

    // Assertions
    assert.strictEqual(result.length, 50, 'Should return exactly 50 lines');
    assert.ok(result[0].startsWith('Line 1951:'), `Expected first line to be Line 1951, got: ${result[0]}`);
    assert.ok(result[49].startsWith('Line 2000:'), `Expected last line to be Line 2000, got: ${result[49]}`);

    console.log('✅ Correctness Test Passed');

    // Test Edge Case: Small file (< 16KB)
    const smallLines = [];
    for (let i = 1; i <= 10; i++) {
        smallLines.push(`Small Line ${i}`);
    }
    fs.writeFileSync(TEST_LOG_FILE, smallLines.join('\n') + '\n');

    const smallResult = await getLogHistory(TEST_LOG_FILE);
    assert.strictEqual(smallResult.length, 10, 'Should return all 10 lines for small file');
    assert.ok(smallResult[0].startsWith('Small Line 1'), 'First line match');
    assert.ok(smallResult[9].startsWith('Small Line 10'), 'Last line match');

    console.log('✅ Small File Test Passed');

    fs.unlinkSync(TEST_LOG_FILE);
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
