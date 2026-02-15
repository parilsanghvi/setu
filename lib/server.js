const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');
const db = require('./db');

class DashboardServer {
    constructor(port = 3000) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.port = port;

        this.setupRoutes();
        this.setupSocket();
    }

    setupRoutes() {
        // Serve Static Files
        this.app.use(express.static(path.join(__dirname, '../frontend/dashboard')));

        // API: Stats
        this.app.get('/api/stats', (req, res) => {
            const agents = db.db.prepare('SELECT count(*) as count FROM agents WHERE status != "OFFLINE"').get();
            const tasks = db.db.prepare('SELECT count(*) as count FROM tasks WHERE status != "DONE"').get();
            res.json({
                activeAgents: agents.count,
                pendingTasks: tasks.count,
                uptime: process.uptime()
            });
        });

        // API: Tasks
        this.app.get('/api/tasks', (req, res) => {
            const tasks = db.db.prepare('SELECT * FROM tasks ORDER BY updated_at DESC').all();
            res.json(tasks);
        });

        // API: Agents
        this.app.get('/api/agents', (req, res) => {
            const agents = db.db.prepare('SELECT * FROM agents').all();
            res.json(agents);
        });
    }

    setupSocket() {
        this.io.on('connection', (socket) => {
            console.log('[GUI] User connected to Dashboard');

            // Emit initial log tail
            const logFile = path.join(__dirname, '../setu.log');
            if (fs.existsSync(logFile)) {
                const logs = fs.readFileSync(logFile, 'utf8').split('\n').slice(-20);
                socket.emit('log_history', logs);
            }

            socket.on('disconnect', () => {
                console.log('[GUI] User disconnected');
            });
        });

        // Watch log file and stream
        const logFile = path.join(__dirname, '../setu.log');
        let fileSize = 0;

        try {
            fileSize = fs.statSync(logFile).size;
        } catch (e) { }

        fs.watchFile(logFile, { interval: 500 }, (curr, prev) => {
            if (curr.size > prev.size) {
                const stream = fs.createReadStream(logFile, { start: prev.size, end: curr.size });
                stream.on('data', (chunk) => {
                    this.io.emit('log', chunk.toString());
                });
            }
        });

        // Poll DB for updates (Simulated "Push" from DB)
        setInterval(() => {
            const agents = db.db.prepare('SELECT * FROM agents').all();
            this.io.emit('agents_update', agents);

            const tasks = db.db.prepare('SELECT * FROM tasks').all();
            this.io.emit('tasks_update', tasks);
        }, 2000);
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`[GUI] Dashboard running at http://localhost:${this.port}`);
        });
    }
}

// Standalone run
if (require.main === module) {
    new DashboardServer().start();
}

module.exports = DashboardServer;
