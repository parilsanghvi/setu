const fs = require('fs/promises');

/**
 * Efficiently reads the last N lines of a file without loading the entire file into memory.
 * Optimized to avoid O(n^2) string concatenation and repeated regex scans.
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
        const chunks = [];
        let newlinesFound = 0;
        let totalSize = 0;

        // Allocate reading buffer once outside the loop to avoid allocations in hot path
        const readBuffer = Buffer.alloc(CHUNK_SIZE);

        // Read chunks from the end until we have enough newlines or hit the start
        while (position > 0) {
            const length = Math.min(CHUNK_SIZE, position);
            position -= length;

            const { bytesRead } = await fileHandle.read(readBuffer, 0, length, position);

            if (bytesRead === 0) break;

            const validBuffer = readBuffer.subarray(0, bytesRead);

            // Explicitly copy the buffer to avoid multiple references to the same memory
            chunks.push(Buffer.from(validBuffer));
            totalSize += bytesRead;

            // Count newlines in this chunk buffer directly (much faster than string conversion)
            for (let i = 0; i < bytesRead; i++) {
                if (validBuffer[i] === 10) { // 10 is '\n' in ASCII/UTF-8
                    newlinesFound++;
                }
            }

            // We need maxLineCount + 1 to ensure we have maxLineCount full lines,
            // because the very last chunk might not start exactly at a newline boundary.
            if (newlinesFound > maxLineCount) {
                break;
            }

            // Safety break: if we've read > 1MB and still haven't found enough newlines,
            // the lines are likely extremely long or the file is binary/weird.
            // We stop to prevent memory issues.
            if (totalSize > 1024 * 1024) break;
        }

        // Combine buffers efficiently before converting to string once
        const combinedBuffer = Buffer.concat(chunks.reverse());
        const fileContent = combinedBuffer.toString(encoding);

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


/**
 * Recursively estimates the JSON string length of a value without serialization.
 * Used for performance critical token counting.
 */
function estimateJsonLength(obj) {
    if (obj === null) return 4; // "null"
    if (obj === undefined) return 0; // Fallback

    if (typeof obj === 'string') return obj.length + 2; // "string"
    if (typeof obj === 'number') return String(obj).length;
    if (typeof obj === 'boolean') return obj ? 4 : 5; // "true" or "false"

    if (Array.isArray(obj)) {
        let len = 2; // []
        if (obj.length > 0) len += obj.length - 1; // commas
        for (const item of obj) {
            if (item === undefined) {
                len += 4; // "null"
            } else {
                len += estimateJsonLength(item);
            }
        }
        return len;
    }

    if (typeof obj === 'object') {
        let len = 2; // {}
        const keys = Object.keys(obj);
        let validKeys = 0;
        for (const key of keys) {
            const val = obj[key];
            if (val === undefined) continue; // Skip undefined keys

            // If function, symbol, skip too (JSON.stringify behavior)
            if (typeof val === 'function' || typeof val === 'symbol') continue;

            if (validKeys > 0) len += 1; // comma
            validKeys++;

            len += key.length + 3; // "key":
            len += estimateJsonLength(val);
        }
        return len;
    }

    return 0;
}

let onboardingLogCache = null;
let onboardingLastMtime = 0;

async function getCachedOnboardingRuns(logPath) {
    try {
        const stats = await fs.promises.stat(logPath);
        if (onboardingLogCache && stats.mtimeMs === onboardingLastMtime) {
            return onboardingLogCache;
        }

        const lines = await readLastLines(logPath, 20);
        const allRuns = lines.map(l => {
            try { return JSON.parse(l); } catch (e) { return null; }
        }).filter(Boolean);

        const result = allRuns;
        onboardingLogCache = result;
        onboardingLastMtime = stats.mtimeMs;
        return result;
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

module.exports = { readLastLines, estimateJsonLength, getCachedOnboardingRuns };
