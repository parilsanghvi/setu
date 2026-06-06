const { readLastLines } = require('../lib/utils.js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { test, after } = require('node:test');

const tempDir = path.join(__dirname, 'temp_logs');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Clean up after all tests
after(() => {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

function createTestFile(filename, content) {
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
}

test('readLastLines: reads small file correctly', async () => {
    const filePath = createTestFile('small.log', 'line1\nline2\nline3\n');
    const lines = await readLastLines(filePath, 2);
    assert.deepStrictEqual(lines, ['line2', 'line3']);
});

test('readLastLines: reads entire small file if requested lines > file lines', async () => {
    const filePath = createTestFile('small_all.log', 'line1\nline2\nline3\n');
    const lines = await readLastLines(filePath, 5);
    assert.deepStrictEqual(lines, ['line1', 'line2', 'line3']);
});

test('readLastLines: handles empty file', async () => {
    const filePath = createTestFile('empty.log', '');
    const lines = await readLastLines(filePath, 5);
    assert.deepStrictEqual(lines, []);
});

test('readLastLines: handles file without trailing newline', async () => {
    const filePath = createTestFile('no_trailing.log', 'line1\nline2\nline3');
    const lines = await readLastLines(filePath, 2);
    assert.deepStrictEqual(lines, ['line2', 'line3']);
});

test('readLastLines: handles non-existent file', async () => {
    const filePath = path.join(tempDir, 'non_existent.log');
    const lines = await readLastLines(filePath, 5);
    assert.deepStrictEqual(lines, []);
});

test('readLastLines: correctly handles fs.open ENOENT error', async () => {
    const fsPromises = require('fs/promises');
    const originalOpen = fsPromises.open;
    try {
        fsPromises.open = async () => {
            const error = new Error('ENOENT: no such file or directory');
            error.code = 'ENOENT';
            throw error;
        };
        const lines = await readLastLines('fake_file.log', 5);
        assert.deepStrictEqual(lines, []);
    } finally {
        fsPromises.open = originalOpen;
    }
});

test('readLastLines: catches other fs.open errors and returns empty array', async () => {
    const fsPromises = require('fs/promises');
    const originalOpen = fsPromises.open;
    const originalConsoleError = console.error;
    console.error = () => {};
    try {
        fsPromises.open = async () => {
            const error = new Error('EACCES: permission denied');
            error.code = 'EACCES';
            throw error;
        };
        const lines = await readLastLines('fake_file.log', 5);
        assert.deepStrictEqual(lines, []);
    } finally {
        fsPromises.open = originalOpen;
        console.error = originalConsoleError;
    }
});

test('readLastLines: reads large file correctly', async () => {
    const largeContent = Array.from({ length: 1000 }, (_, i) => `line${i}`).join('\n') + '\n';
    const filePath = createTestFile('large.log', largeContent);

    const lines = await readLastLines(filePath, 5);
    assert.deepStrictEqual(lines, ['line995', 'line996', 'line997', 'line998', 'line999']);
});

test('readLastLines: efficient with very large file', async () => {
    // Creating a large file (~17MB)
    const line = 'This is a long line used to fill up space in the file.\n';
    const count = 300000;
    const filePath = path.join(tempDir, 'huge.log');

    const stream = fs.createWriteStream(filePath);
    const writePromise = new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });

    for (let i = 0; i < count; i++) {
        if (!stream.write(`line${i}: ${line}`)) {
            await new Promise(resolve => stream.once('drain', resolve));
        }
    }
    stream.end();

    await writePromise;

    const start = Date.now();
    const lines = await readLastLines(filePath, 5);
    const duration = Date.now() - start;

    console.log(`Read 5 lines from huge file in ${duration}ms`);

    assert.strictEqual(lines.length, 5);
    assert.ok(lines[4].startsWith(`line${count-1}:`));
    assert.ok(duration < 200, "Should be very fast (<200ms)");
});
