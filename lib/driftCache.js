const fs = require('fs');

let cached_total_runs = 0;
let last_size = 0;
let is_updating = false;
let update_promise = null;
let last_update_time = 0;

async function _updateCache(logPath) {
    try {
        const stats = await fs.promises.stat(logPath).catch(() => null);
        if (!stats) {
            cached_total_runs = 0;
            last_size = 0;
            return;
        }

        if (stats.size === last_size && stats.mtimeMs <= last_update_time) {
            return;
        }

        let startPos = last_size;
        let currentTotal = cached_total_runs;

        // If file shrank (e.g. truncated or recreated), reset
        if (stats.size < last_size) {
            startPos = 0;
            currentTotal = 0;
        }

        let new_lines = 0;
        await new Promise((resolve, reject) => {
            // Only read if there is new data
            if (startPos >= stats.size) return resolve();

            const stream = fs.createReadStream(logPath, { start: startPos, end: stats.size - 1 });
            stream.on('data', chunk => {
                for (let i = 0; i < chunk.length; ++i) {
                    if (chunk[i] === 10) new_lines++;
                }
            });
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        cached_total_runs = currentTotal + new_lines;
        last_size = stats.size;
        last_update_time = stats.mtimeMs;
    } catch (err) {
        console.error('Error updating drift cache:', err);
    }
}

async function getTotalRuns(logPath) {
    if (!is_updating) {
        is_updating = true;
        update_promise = _updateCache(logPath).finally(() => {
            is_updating = false;
        });
    }

    // If it's the first time reading, wait for it so we don't return 0 on cold start.
    if (last_size === 0) {
        await update_promise;
    }

    return cached_total_runs;
}

module.exports = { getTotalRuns };
