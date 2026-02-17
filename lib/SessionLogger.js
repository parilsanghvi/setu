const fs = require('fs');
const path = require('path');

class SessionLogger {
    constructor(agentName) {
        this.agentName = agentName;
        // Use a consistent session ID for the process lifetime?
        // Or one file per day?
        // Plan says: "Store agent sessions as JSONL"
        // Let's do one file per session (process start).
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // Ensure directory exists
        const logDir = path.join(process.cwd(), 'logs', 'sessions');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        this.filePath = path.join(logDir, `${agentName}_${timestamp}.jsonl`);
        this.startTime = Date.now();
        this.lastEventId = null;

        // Initialize write stream for asynchronous logging
        this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });

        // Handle stream errors to prevent crashes
        this.stream.on('error', (err) => {
            console.error(`[SessionLogger] Stream error for ${this.filePath}: ${err.message}`);
        });
    }

    log(event) {
        // Event should be an object
        // Generate a random ID (simple/fast) or UUID
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        try {
            const entry = {
                id: id,
                parentId: this.lastEventId,
                timestamp: new Date().toISOString(),
                ...event
            };

            this.lastEventId = id;

            // Asynchronous write using stream
            const success = this.stream.write(JSON.stringify(entry) + '\n');

            if (!success) {
                // Stream buffer is full, handle backpressure if needed
                // For logging, we usually just let it drain in background
            }
        } catch (e) {
            console.error(`[SessionLogger] Failed to write log: ${e.message}`);
        }
    }

    end(callback) {
        if (this.stream) {
            this.stream.end(callback);
        } else if (callback) {
            callback();
        }
    }
}

module.exports = SessionLogger;
