const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const db = require('./db');
const authMiddleware = require('./middleware/auth');
const { readLastLines } = require('./utils');

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
        // Security Headers
        this.app.use(helmet());

        // 🛡️ Security: Authentication Middleware
        this.app.use(authMiddleware);

        // Serve Screenshots securely
        this.app.use('/screenshots', express.static(path.join(__dirname, '../frontend/dashboard/screenshots'), { index: false }));

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

        // API: Create Task
        this.app.use(express.json()); // Enable JSON body parsing
        this.app.post('/api/tasks', (req, res) => {
            const { title, type } = req.body;
            if (!title) return res.status(400).json({ error: 'Title required' });

            const id = `TASK-${Date.now().toString().slice(-4)}`;
            db.updateTask(id, 'TODO', { title, type: type || 'generic', created_at: new Date().toISOString() });

            // Notify Contractor (if running)
            // In a real app, we'd emit an event on the bus.
            // bus.emit('new_task', { id, title }); 

            res.json({ id, status: 'TODO' });
        });

        // API: Get Screenshots for Task
        this.app.get('/api/tasks/:id/screenshots', (req, res) => {
            const taskId = req.params.id;

    // Security: Validate taskId to prevent Path Traversal
    if (!/^[a-zA-Z0-9-_]+$/.test(taskId)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
            const baseDir = path.join(__dirname, '../frontend/dashboard/screenshots');
            const screenshotDir = path.join(baseDir, taskId);

            // Security check: Prevent path traversal
            const resolvedPath = path.resolve(screenshotDir);
            const resolvedBase = path.resolve(baseDir);

            if (!resolvedPath.startsWith(resolvedBase)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            if (!fs.existsSync(resolvedPath)) {
                return res.json([]);
            }

            try {
                const files = fs.readdirSync(resolvedPath).filter(f => f.endsWith('.png'));
                const urls = files.map(f => `/screenshots/${taskId}/${f}`);
                res.json(urls);
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });

        // API: Chat with Agent
        this.app.post('/api/chat', (req, res) => {
            const { agent, message } = req.body;
            if (!agent || !message) return res.status(400).json({ error: 'Agent and Message required' });

            // Send to Bus
            const dbBus = require('./db');
            dbBus.send('User', agent, message, 'chat_message', { via: 'gui' });

            res.json({ status: 'sent', to: agent });
        });
    }

    setupSocket() {
        this.io.on('connection', async (socket) => {
            console.log('[GUI] User connected to Dashboard');

            // Emit initial log tail
            const logFile = path.join(__dirname, '../setu.log');
            try {
                const logs = await readLastLines(logFile, 20);
                socket.emit('log_history', logs);
            } catch (err) {
                console.error(`[GUI] Failed to read log history: ${err.message}`);
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
        } catch (e) {
            console.error(`[GUI] Warning: Could not read log file size: ${e.message}`);
        }

        fs.watchFile(logFile, { interval: 500 }, (curr, prev) => {
            if (curr.size > prev.size) {
                const stream = fs.createReadStream(logFile, { start: prev.size, end: curr.size });
                stream.on('data', (chunk) => {
                    this.io.emit('log', chunk.toString());
                });
            }
        });

        // Listen to Bus and forward to Socket
        const bus = require('./db');
        bus.on('message', (msg) => {
            if (msg.type === 'chat' || msg.type === 'chat_message') {
                this.io.emit('chat_message', msg);
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
