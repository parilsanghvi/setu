const path = require('path');
const fs = require('fs');
const db = require('../db');
const { readLastLines } = require('../utils');

class DashboardSocket {
    constructor(io, logger) {
        this.io = io;
        this.logger = logger;
        this.watchTimeouts = [];
        this.watcher = null;
        this.pollInterval = null;
    }

    setup() {
        this.io.on('connection', async (socket) => {
            this.logger.info('User connected to Dashboard');

            // Emit initial log tail
            const logFile = path.join(__dirname, '../../setu.log');
            try {
                const logs = await readLastLines(logFile, 20);
                socket.emit('log_history', logs);
            } catch (err) {
                this.logger.error(`Failed to read log history: ${err.message}`);
            }

            socket.on('disconnect', () => {
                this.logger.info('User disconnected');
            });
        });

        // Watch log file and stream
        const logFile = path.join(__dirname, '../../setu.log');
        let fileSize = 0;

        const setupWatcher = () => {
            if (this.watcher) {
                this.watcher.close();
                this.watcher = null;
            }

            if (!fs.existsSync(logFile)) {
                // Retry if file doesn't exist yet
                const tm = setTimeout(setupWatcher, 2000);
                this.watchTimeouts.push(tm);
                return;
            }

            try {
                fileSize = fs.statSync(logFile).size;

                // Use fs.watch for better performance than polling
                this.watcher = fs.watch(logFile, (eventType) => {
                    if (eventType === 'rename') {
                        // File renamed/deleted (log rotation), re-watch
                        const tm = setTimeout(setupWatcher, 1000);
                        this.watchTimeouts.push(tm);
                    } else if (eventType === 'change') {
                        fs.stat(logFile, (err, stats) => {
                            if (err) return; // File might be gone/locked

                            const currSize = stats.size;
                            if (currSize > fileSize) {
                                const stream = fs.createReadStream(logFile, { start: fileSize, end: currSize - 1 });
                                stream.on('data', (chunk) => {
                                    this.io.emit('log', chunk.toString());
                                });
                                fileSize = currSize;
                            } else if (currSize < fileSize) {
                                // Handle file truncation (e.g. log rotation reuse)
                                fileSize = currSize;
                            }
                        });
                    }
                });

                this.watcher.on('error', (e) => {
                    this.logger.error(`Log watcher error: ${e.message}`);
                    const tm = setTimeout(setupWatcher, 2000);
                    this.watchTimeouts.push(tm);
                });
            } catch (e) {
                this.logger.error(`Warning: Could not setup log watcher: ${e.message}`);
                const tm = setTimeout(setupWatcher, 5000);
                this.watchTimeouts.push(tm);
            }
        };

        setupWatcher();

        // Listen to Bus and forward to Socket
        const bus = require('../db');
        bus.on('message', (msg) => {
            if (msg.type === 'chat' || msg.type === 'chat_message') {
                this.io.emit('chat_message', msg);
            }
        });

        // Poll DB for updates (Simulated "Push" from DB)
        this.pollInterval = setInterval(() => {
            const agents = db.db.prepare('SELECT * FROM agents').all();
            this.io.emit('agents_update', agents);

            const tasks = db.db.prepare('SELECT * FROM tasks').all();
            this.io.emit('tasks_update', tasks);
        }, 2000);
    }

    stop() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        if (this.watchTimeouts) this.watchTimeouts.forEach(clearTimeout);
        if (this.watcher) this.watcher.close();
    }
}

module.exports = DashboardSocket;
