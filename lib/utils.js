const fs = require('fs/promises');

/**
 * Efficiently reads the last N lines of a file without loading the entire file into memory.
 *
 * @param {string} filePath - Path to the file
 * @param {number} maxLineCount - Number of lines to read from the end
 * @param {string} encoding - File encoding (default: 'utf8')
 * @returns {Promise<string[]>} Array of lines
 */
async function readLastLines(filePath, maxLineCount = 20, encoding = 'utf8') {
    let fileHandle = null;
    try {
        try {
            fileHandle = await fs.open(filePath, 'r');
        } catch (e) {
            if (e.code === 'ENOENT') return [];
            throw e;
        }

        const stats = await fileHandle.stat();
        if (stats.size === 0) {
            await fileHandle.close();
            return [];
        }

        const CHUNK_SIZE = 8192;
        let position = stats.size;
        let fileContent = '';

        // Read chunks from the end until we have enough newlines or hit the start
        while (position > 0) {
            const length = Math.min(CHUNK_SIZE, position);
            position -= length;

            const buffer = Buffer.alloc(length);
            const { bytesRead } = await fileHandle.read(buffer, 0, length, position);

            if (bytesRead === 0) break;

            const chunk = buffer.subarray(0, bytesRead).toString(encoding);
            fileContent = chunk + fileContent;

            // Check if we have enough lines
            // We need maxLineCount newlines to get maxLineCount+1 lines (potentially)
            // But simplified check is good enough: split count
            if ((fileContent.match(/\n/g) || []).length >= maxLineCount) {
                break;
            }

            // Safety break: if we've read > 1MB and still haven't found enough newlines,
            // the lines are likely extremely long or the file is binary/weird.
            // We stop to prevent memory issues.
            if (fileContent.length > 1024 * 1024) break;
        }

        const lines = fileContent.split('\n');

        // If the file ends with a newline, the last element is an empty string.
        // We typically want to ignore this trailing empty line for "tail" behavior.
        if (lines.length > 0 && lines[lines.length - 1] === '') {
            lines.pop();
        }

        return lines.slice(-maxLineCount);

    } catch (err) {
        console.error(`Error reading log file ${filePath}:`, err);
        return [];
    } finally {
        if (fileHandle) {
            try {
                await fileHandle.close();
            } catch (e) {
                // Ignore close errors
            }
        }
    }
}

module.exports = { readLastLines };
