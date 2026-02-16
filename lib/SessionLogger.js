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
    }

    log(event) {
        // Event should be an object
        // Generate a random ID (simple/fast) or UUID
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const entry = {
            id: id,
            parentId: this.lastEventId,
            timestamp: new Date().toISOString(),
            ...event
        };

        this.lastEventId = id;

        try {
            fs.appendFileSync(this.filePath, JSON.stringify(entry) + '\n');
        } catch (e) {
            console.error(`[SessionLogger] Failed to write log: ${e.message}`);
        }
    }
}

module.exports = SessionLogger;
