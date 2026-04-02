const fs = require('fs');
const path = require('path');
const db = require('./db');
const { readLastLines } = require('./utils');

function setupSocket(io, logger) {
    const context = {
        pollInterval: null,
        watchTimeouts: [],
        watcher: null
    };

    io.on('connection', async (socket) => {
        logger.info('User connected to Dashboard');

        // Emit initial log tail
        const logFile = path.join(__dirname, '../setu.log');
        try {
            const logs = await readLastLines(logFile, 20);
            socket.emit('log_history', logs);
        } catch (err) {
            logger.error(`Failed to read log history: ${err.message}`);
        }

        socket.on('disconnect', () => {
            logger.info('User disconnected');
        });
    });

    // Watch log file and stream
    const logFile = path.join(__dirname, '../setu.log');
    let fileSize = 0;

    const setupWatcher = () => {
        if (context.watcher) {
            context.watcher.close();
            context.watcher = null;
        }

        if (!fs.existsSync(logFile)) {
            // Retry if file doesn't exist yet
            const tm = setTimeout(setupWatcher, 2000);
            context.watchTimeouts.push(tm);
            return;
        }

        try {
            fileSize = fs.statSync(logFile).size;

            // Use fs.watch for better performance than polling
            const watcher = fs.watch(logFile, (eventType) => {
                if (eventType === 'rename') {
                    // File renamed/deleted (log rotation), re-watch
                    const tm = setTimeout(setupWatcher, 1000);
                    context.watchTimeouts.push(tm);
                } else if (eventType === 'change') {
                    fs.stat(logFile, (err, stats) => {
                        if (err) return; // File might be gone/locked

                        const currSize = stats.size;
                        if (currSize > fileSize) {
                            const stream = fs.createReadStream(logFile, { start: fileSize, end: currSize - 1 });
                            stream.on('data', (chunk) => {
                                io.emit('log', chunk.toString());
                            });
                            fileSize = currSize;
                        } else if (currSize < fileSize) {
                            // Handle file truncation (e.g. log rotation reuse)
                            fileSize = currSize;
                        }
                    });
                }
            });

            context.watcher = watcher;

            watcher.on('error', (e) => {
                logger.error(`Log watcher error: ${e.message}`);
                const tm = setTimeout(setupWatcher, 2000);
                context.watchTimeouts.push(tm);
            });
        } catch (e) {
            logger.error(`Warning: Could not setup log watcher: ${e.message}`);
            const tm = setTimeout(setupWatcher, 5000);
            context.watchTimeouts.push(tm);
        }
    };

    setupWatcher();

    // Listen to Bus and forward to Socket
    db.on('message', (msg) => {
        if (msg.type === 'chat' || msg.type === 'chat_message') {
            io.emit('chat_message', msg);
        }
    });

    // Poll DB for updates (Simulated "Push" from DB)
    let lastTaskMeta = { t: null, c: null };
    let lastAgentsHash = '';

    context.pollInterval = setInterval(() => {
        // Optimize Agent polling by excluding last_heartbeat for hash comparison
        const agents = db.db.prepare('SELECT * FROM agents').all();
        const leanAgents = agents.map(a => ({ name: a.name, role: a.role, status: a.status, pid: a.pid }));
        const agentsHash = JSON.stringify(leanAgents);

        if (agentsHash !== lastAgentsHash) {
            io.emit('agents_update', agents);
            lastAgentsHash = agentsHash;
        }

        // Optimize Tasks polling using getTaskMeta()
        const meta = db.getTaskMeta();
        if (meta.t !== lastTaskMeta.t || meta.c !== lastTaskMeta.c) {
            const tasks = db.db.prepare('SELECT * FROM tasks').all();
            io.emit('tasks_update', tasks);
            lastTaskMeta = meta;
        }
    }, 2000);

    // Return a teardown closure to safely close dynamically recreated watchers
    return function teardown() {
        if (context.pollInterval) clearInterval(context.pollInterval);
        if (context.watchTimeouts) context.watchTimeouts.forEach(clearTimeout);
        if (context.watcher) context.watcher.close();
    };
}

module.exports = setupSocket;
