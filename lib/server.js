const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const db = require('./db');
const authMiddleware = require('./middleware/auth');
const { readLastLines } = require('./utils');
const Logger = require('./Logger');
const { getSetuPath } = require('./onboarding/paths');

class DashboardServer {
    constructor(port = 3000) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.port = port;
        this.logger = new Logger('GUI');

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

        // API: Onboarding Status
        this.app.get('/api/onboarding', (req, res) => {
            try {
                const { getOnboardingStatus } = require('./onboarding/status');
                const status = getOnboardingStatus();
                res.json(status);
            } catch (e) {
                this.logger.error(`Error in /api/onboarding: ${e.message}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // API: Onboarding Historical Trend
        this.app.get('/api/onboarding-trend', (req, res) => {
            try {
                const logPath = getSetuPath('onboarding-history.jsonl');
                if (!fs.existsSync(logPath)) {
                    return res.json({ runs: [], error: 'No history found' });
                }
                const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
                const allRuns = lines.map(l => {
                    try { return JSON.parse(l); } catch (e) { return null; }
                }).filter(Boolean);
                res.json({ runs: allRuns.slice(-20) });
            } catch (e) {
                this.logger.error(`Error in /api/onboarding-trend: ${e.message}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // API: Drift Trend
        this.app.get('/api/drift-trend', (req, res) => {
            try {
                const logPath = getSetuPath('drift-history.jsonl');
                if (!fs.existsSync(logPath)) {
                    return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });
                }
                const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
                const allRuns = lines.map(l => {
                    try { return JSON.parse(l); } catch (e) { return null; }
                }).filter(Boolean);

                if (allRuns.length === 0) return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });
                const last20 = allRuns.slice(-20);
                const fails = last20.filter(r => !r.ok).length;
                const failRate = ((fails / last20.length) * 100).toFixed(1);

                const avgDrift = (last20.reduce((acc, r) => acc + r.drift_percent, 0) / last20.length).toFixed(1);

                const missingFreq = {};
                last20.forEach(r => {
                    if (r.missing_docs) {
                        r.missing_docs.forEach(d => missingFreq[d] = (missingFreq[d] || 0) + 1);
                    }
                });

                const top = Object.entries(missingFreq).sort((a, b) => b[1] - a[1])[0];
                const topMissing = top ? top[0].replace('docs/files/', '') : 'None';

                const lastRun = last20[last20.length - 1];
                const unowned = lastRun.ownership && lastRun.ownership.unowned_files ? lastRun.ownership.unowned_files.length : 0;

                const { getActiveProfile } = require('./onboarding/governance-profiles');
                const activeProfile = getActiveProfile();

                res.json({
                    total_runs: allRuns.length,
                    fail_rate: parseFloat(failRate),
                    drift_percent: parseFloat(avgDrift),
                    top_missing: topMissing,
                    last_status: lastRun.ok ? '✅ Pass' : '🛑 Fail',
                    unowned_count: unowned,
                    profile: activeProfile.name.toUpperCase(),
                    strict_diff: activeProfile.config.strict_diff
                });
            } catch (e) {
                this.logger.error(`Error in /api/drift-trend: ${e.message}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

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
            // Security: Enforce onboarding hard gate
            const { getOnboardingStatus } = require('./onboarding/status');
            const taskStat = getOnboardingStatus({ fast: true });

            if (!taskStat.ok) {
                return res.status(403).json({
                    error: 'Hard Gate Failure: Onboarding Incomplete',
                    missing: taskStat.missing,
                    details: taskStat.errors,
                    remediation: 'Run "setu onboarding run --only-missing" via CLI'
                });
            }

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
                this.logger.error(`Error getting screenshots for task ${taskId}: ${e.message}`);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // API: Chat with Agent
        this.app.post('/api/chat', (req, res) => {
            const { agent, message } = req.body;
            if (!agent || !message) return res.status(400).json({ error: 'Agent and Message required' });

            // Security: Input Length Validation
            const MAX_MESSAGE_LENGTH = 10000; // 10KB
            if (message.length > MAX_MESSAGE_LENGTH) {
                return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
            }

            // Send to Bus
            const dbBus = require('./db');
            dbBus.send('User', agent, message, 'chat_message', { via: 'gui' });

            res.json({ status: 'sent', to: agent });
        });
    }

    setupSocket() {
        this.io.on('connection', async (socket) => {
            this.logger.info('User connected to Dashboard');

            // Emit initial log tail
            const logFile = path.join(__dirname, '../setu.log');
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
        const logFile = path.join(__dirname, '../setu.log');
        let fileSize = 0;
        let watcher = null;
        this.watchTimeouts = [];

        const setupWatcher = () => {
            if (watcher) {
                watcher.close();
                watcher = null;
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
                watcher = fs.watch(logFile, (eventType) => {
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

                this.watcher = watcher;

                watcher.on('error', (e) => {
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
        const bus = require('./db');
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

    start() {
        this.server.listen(this.port, () => {
            this.logger.info(`Dashboard running at http://localhost:${this.port}`);
        });
    }

    stop() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        if (this.watchTimeouts) this.watchTimeouts.forEach(clearTimeout);
        if (this.watcher) this.watcher.close();
        if (this.io) this.io.close();
        if (this.server) this.server.close();
    }
}

// Standalone run
if (require.main === module) {
    new DashboardServer().start();
}

module.exports = DashboardServer;
