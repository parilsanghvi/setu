const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const db = require('./db');
const authMiddleware = require('./middleware/auth');
const { readLastLines } = require('./utils');
const { getSetuPath } = require('./onboarding/paths');

function setupRoutes(app, logger) {
    // Security Headers
    app.use(helmet());

    // 🛡️ Security: Authentication Middleware
    app.use(authMiddleware);

    // Serve Screenshots securely
    app.use('/screenshots', express.static(path.join(__dirname, '../frontend/dashboard/screenshots'), { index: false }));

    // Serve Static Files
    app.use(express.static(path.join(__dirname, '../frontend/dashboard')));

    // API: Onboarding Status
    app.get('/api/onboarding', (req, res) => {
        try {
            const { getOnboardingStatus } = require('./onboarding/status');
            // Optimization: Use fast cache path instead of full sync filesystem scan
            const status = getOnboardingStatus({ fast: true });
            res.json(status);
        } catch (e) {
            logger.error(`Error in /api/onboarding: ${e.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API: Onboarding Historical Trend
    app.get('/api/onboarding-trend', async (req, res) => {
        try {
            const logPath = getSetuPath('onboarding-history.jsonl');
            try {
                await fs.promises.access(logPath);
            } catch (err) {
                return res.json({ runs: [], error: 'No history found' });
            }
            // Optimization: Read only the last 20 lines directly
            const lines = await readLastLines(logPath, 20);
            const lastRuns = lines.map(l => {
                try { return JSON.parse(l); } catch (e) { return null; }
            }).filter(Boolean);
            res.json({ runs: lastRuns });
        } catch (e) {
            logger.error(`Error in /api/onboarding-trend: ${e.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API: Drift Trend
    app.get('/api/drift-trend', async (req, res) => {
        try {
            const logPath = getSetuPath('drift-history.jsonl');
            try {
                await fs.promises.access(logPath);
            } catch {
                return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });
            }

            let total_runs = 0;
            try {
                await new Promise((resolve, reject) => {
                    const stream = fs.createReadStream(logPath);
                    stream.on('data', chunk => {
                        for (let i = 0; i < chunk.length; ++i) {
                            if (chunk[i] === 10) total_runs++;
                        }
                    });
                    stream.on('end', resolve);
                    stream.on('error', reject);
                });
            } catch (err) {
                logger.error('Stream error reading drift history:', err);
            }

            const last20Lines = await readLastLines(logPath, 20);
            const last20 = last20Lines.map(l => {
                try { return JSON.parse(l); } catch (e) { return null; }
            }).filter(Boolean);

            if (total_runs === 0 && last20Lines.length > 0) total_runs = last20Lines.length;

            if (last20.length === 0) return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });

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
            const unowned = (lastRun && lastRun.ownership && lastRun.ownership.unowned_files) ? lastRun.ownership.unowned_files.length : 0;

            const { getActiveProfile } = require('./onboarding/governance-profiles');
            const activeProfile = getActiveProfile();

            res.json({
                total_runs: total_runs,
                fail_rate: parseFloat(failRate),
                drift_percent: parseFloat(avgDrift),
                top_missing: topMissing,
                last_status: lastRun.ok ? '✅ Pass' : '🛑 Fail',
                unowned_count: unowned,
                profile: activeProfile.name.toUpperCase(),
                strict_diff: activeProfile.config.strict_diff
            });
        } catch (e) {
            logger.error(`Error in /api/drift-trend: ${e.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API: Stats
    app.get('/api/stats', (req, res) => {
        const agents = db.db.prepare("SELECT count(*) as count FROM agents WHERE status != 'OFFLINE'").get();
        const tasks = db.db.prepare("SELECT count(*) as count FROM tasks WHERE status != 'DONE'").get();
        res.json({
            activeAgents: agents.count,
            pendingTasks: tasks.count,
            uptime: process.uptime()
        });
    });

    // API: Tasks
    app.get('/api/tasks', (req, res) => {
        const tasks = db.db.prepare('SELECT * FROM tasks ORDER BY updated_at DESC').all();
        res.json(tasks);
    });

    // API: Agents
    app.get('/api/agents', (req, res) => {
        const agents = db.db.prepare('SELECT * FROM agents').all();
        res.json(agents);
    });

    // API: Create Task
    app.use(express.json()); // Enable JSON body parsing
    app.post('/api/tasks', (req, res) => {
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

    // API: Delete Task
    app.delete('/api/tasks/:id', (req, res) => {
        const id = req.params.id;
        db.deleteTask(id);
        res.json({ id, status: 'DELETED' });
    });

    // API: Update Existing Task
    app.put('/api/tasks/:id', (req, res) => {
        const id = req.params.id;
        const { status, title, owner, assignee } = req.body;
        db.updateTask(id, status, { title, owner, assignee });
        res.json({ id, status });
    });

    // API: Git Commit
    // Security: Apply defense-in-depth authMiddleware to prevent unauthorized git command execution
    app.post('/api/git/commit', authMiddleware, (req, res) => {
        const { execFile } = require('child_process');
        execFile('git', ['add', '.'], { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                logger.error(`[Git] Error adding files: ${error.message}`);
                return res.status(500).json({ error: 'Git add failed', details: stderr });
            }
            execFile('git', ['commit', '-m', 'Auto-commit from Setu dashboard'], { cwd: process.cwd() }, (commitError, commitStdout, commitStderr) => {
                if (commitError) {
                    logger.error(`[Git] Error committing: ${commitError.message}`);
                    return res.status(500).json({ error: 'Git commit failed', details: commitStderr });
                }
                res.json({ success: true, message: 'Git commit successful', stdout: commitStdout });
            });
        });
    });

    // API: Get Screenshots for Task
    app.get('/api/tasks/:id/screenshots', (req, res) => {
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
            logger.error(`[GUI] Error getting screenshots for task ${taskId}: ${e.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API: Chat with Agent
    app.post('/api/chat', (req, res) => {
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

module.exports = setupRoutes;
