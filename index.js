require('dotenv').config();
const { fork } = require('child_process');
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const bus = require('./lib/db');
const readline = require('readline');
const fs = require('fs');
const { readLastLines, getCachedOnboardingRuns } = require('./lib/utils');
const authMiddleware = require('./lib/middleware/auth');

// High-performance write stream for logging (Initialized early to avoid TDZ)
const logStream = fs.createWriteStream(path.join(__dirname, 'setu.log'), { flags: 'a' });
logStream.on('error', (err) => console.error('LOG STREAM ERROR:', err));

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

if (process.env.ALLOWED_ORIGINS) {
  ALLOWED_ORIGINS.push(...process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()));
}

// 👑 SUTRADHAR: The Orchestrator
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// 🛡️ Security: Middleware Pipeline
app.use(helmet()); // 1. Security Headers
app.use(cors({ // 2. CORS (Strict)
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(authMiddleware); // 3. Authentication (Block unauth before parsing body)
app.use(express.json()); // 4. Body Parsing

// Serve Static Files (Production Build & Screenshots)
const frontendDist = path.join(__dirname, 'frontend/app/dist');
app.use(express.static(frontendDist));
app.use('/screenshots', express.static(path.join(__dirname, 'frontend/dashboard/screenshots'), { index: false }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 🛡️ Security: Socket Authentication
const socketAuth = require('./lib/middleware/socketAuth');
io.use(socketAuth);

// --- DASHBOARD API ROUTES ---

// API: Onboarding Status
app.get('/api/onboarding', (req, res) => {
  try {
    const { getOnboardingStatus } = require('./lib/onboarding/status');
    const status = getOnboardingStatus({ fast: true });
    res.json(status);
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Stats
app.get('/api/stats', (req, res) => {
  try {
    const agents = bus.db.prepare("SELECT count(*) as count FROM agents WHERE status != 'OFFLINE'").get();
    const tasks = bus.db.prepare("SELECT count(*) as count FROM tasks WHERE status != 'DONE'").get();
    res.json({
      activeAgents: agents.count,
      pendingTasks: tasks.count,
      uptime: process.uptime()
    });
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = bus.getTasks();
    res.json(tasks);
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Agents
app.get('/api/agents', (req, res) => {
  try {
    const agents = bus.getAgents();
    res.json(agents);
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Create Task
app.post('/api/tasks', (req, res) => {
  const { getOnboardingStatus } = require('./lib/onboarding/status');
  const stat = getOnboardingStatus({ fast: true });
  if (!stat.ok) {
    return res.status(403).json({
      error: 'Hard Gate Failure: Onboarding Incomplete',
      missing: stat.missing,
      details: stat.errors,
      remediation: 'Run "setu onboarding run --only-missing" via CLI'
    });
  }
  const { title, type } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Valid title required' });
  }

  if (title.length > 100) {
    return res.status(400).json({ error: 'Title too long (max 100 chars)' });
  }

  if (type && (typeof type !== 'string' || type.length > 50)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const cleanTitle = title.trim();
  const cleanType = type ? type.trim() : 'generic';

  const id = `TASK-${Date.now().toString().slice(-4)}`;
  bus.updateTask(id, 'TODO', { title: cleanTitle, type: cleanType, created_at: new Date().toISOString() });

  res.json({ id, status: 'TODO' });
});

// API: Get Screenshots for Task
app.get('/api/tasks/:id/screenshots', async (req, res) => {
  const taskId = req.params.id;

  // Security: Validate taskId to prevent Path Traversal
  if (!/^[a-zA-Z0-9-_]+$/.test(taskId)) {
    return res.status(400).json({ error: 'Invalid Task ID format' });
  }
  const baseDir = path.join(__dirname, 'frontend/dashboard/screenshots');
  const screenshotDir = path.join(baseDir, taskId);

  // Security check: Prevent path traversal
  const resolvedPath = path.resolve(screenshotDir);
  const resolvedBase = path.resolve(baseDir);

  if (!resolvedPath.startsWith(resolvedBase)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // ⚡ Bolt: Convert synchronous existsSync to async access for non-blocking I/O
    await fs.promises.access(resolvedPath);
  } catch (e) {
    return res.json([]);
  }

  try {
    // ⚡ Bolt: Convert synchronous readdirSync to async readdir for non-blocking I/O
    const allFiles = await fs.promises.readdir(resolvedPath);
    const files = allFiles.filter(f => f.endsWith('.png'));
    const urls = files.map(f => `/screenshots/${taskId}/${f}`);
    res.json(urls);
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Chat with Agent
app.post('/api/chat', (req, res) => {
  const { agent, message } = req.body;
  log(`[API] /api/chat hit with agent: ${agent}, message: ${message.substring(0, 20)}`);
  if (!agent || !message) return res.status(400).json({ error: 'Agent and Message required' });

  // Security: Input Length Validation
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
  }

  try {
    bus.send('User', agent, message, 'chat', { via: 'gui' });
    log(`[API] Successfully dispatched chat to bus`);
    res.json({ status: 'sent', to: agent });
  } catch (err) {
    log(`[API] Error dispatching chat to bus: ${err.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Interrupt Agent
app.post('/api/agents/:name/interrupt', (req, res) => {
  const { name } = req.params;
  const process = RUNNING_PROCESSES[name];
  if (!process) return res.status(404).json({ error: `Agent ${name} not running` });

  // Security: Ensure process is valid (prevent prototype pollution crash)
  if (typeof process.send !== 'function') {
    return res.status(500).json({ error: `Invalid process state for ${name}` });
  }

  log(`🛑 Sending STOP signal to ${name}...`);
  process.send({ type: 'control', command: 'STOP' });
  res.json({ status: 'sent', signal: 'STOP' });
});

// API: Redirect Agent
app.post('/api/agents/:name/redirect', (req, res) => {
  const { name } = req.params;
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required for redirect' });

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `Prompt too long (max ${MAX_PROMPT_LENGTH} chars)` });
  }

  const process = RUNNING_PROCESSES[name];
  if (!process) return res.status(404).json({ error: `Agent ${name} not running` });

  // Security: Ensure process is valid (prevent prototype pollution crash)
  if (typeof process.send !== 'function') {
    return res.status(500).json({ error: `Invalid process state for ${name}` });
  }

  log(`🔀 Sending REDIRECT signal to ${name}...`);
  process.send({ type: 'control', command: 'REDIRECT', payload: prompt });
  res.json({ status: 'sent', signal: 'REDIRECT' });
});

// API: List Sessions (Time Travel)
app.get('/api/sessions', async (req, res) => {
  const sessionDir = path.join(__dirname, 'logs/sessions');

  try {
    // Check if dir exists asynchronously
    await fs.promises.access(sessionDir);
  } catch {
    return res.json([]);
  }

  try {
    // ⚡ Bolt: Convert synchronous readdirSync/statSync to async for non-blocking I/O
    const fileNames = await fs.promises.readdir(sessionDir);
    const jsonlFiles = fileNames.filter(f => f.endsWith('.jsonl'));

    // ⚡ Bolt: Parallelize stat calls for better performance
    const fileStats = await Promise.all(jsonlFiles.map(async f => {
      const stat = await fs.promises.stat(path.join(sessionDir, f));
      return { name: f, time: stat.mtime };
    }));

    const sortedFiles = fileStats.sort((a, b) => b.time - a.time);
    res.json(sortedFiles);
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API: Get Session Content
app.get('/api/sessions/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'logs/sessions', filename);

  // Security check: prevent directory traversal
  if (path.dirname(filePath) !== path.join(__dirname, 'logs/sessions')) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.trim().split('\n').map(l => {
      try { return JSON.parse(l); } catch (e) { return null; }
    }).filter(x => x);
    res.json(lines);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return res.status(404).json({ error: 'Session not found' });
    }
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- END DASHBOARD API ROUTES ---

// --- TREND API ROUTES (Unified with lib/server.js) ---
const { getSetuPath } = require('./lib/onboarding/paths');

app.get('/api/onboarding-trend', async (req, res) => {
  try {
    const logPath = getSetuPath('onboarding-history.jsonl');
    const lastRuns = await getCachedOnboardingRuns(logPath);
    if (lastRuns.length === 0) {
      // Check if file exists to return correct empty response format
      try {
        await fs.promises.access(logPath);
      } catch (err) {
        return res.json({ runs: [], error: 'No history found' });
      }
    }
    res.json({ runs: lastRuns });
  } catch (e) {
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
      console.error('[SUTRADHAR] Stream error reading drift history:', err);
    }

    const last20Lines = await readLastLines(logPath, 20);
    const last20 = last20Lines.map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);

    // Fallback if file doesn't end with newline but has valid lines
    if (total_runs === 0 && last20Lines.length > 0) total_runs = last20Lines.length;

    if (last20.length === 0) return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });

    const fails = last20.filter(r => !r.ok).length;
    const failRate = ((fails / last20.length) * 100).toFixed(1);
    const avgDrift = (last20.reduce((acc, r) => acc + r.drift_percent, 0) / last20.length).toFixed(1);

    const missingFreq = {};
    last20.forEach(r => { if (r.missing_docs) r.missing_docs.forEach(d => missingFreq[d] = (missingFreq[d] || 0) + 1); });
    const top = Object.entries(missingFreq).sort((a, b) => b[1] - a[1])[0];
    const topMissing = top ? top[0].replace('docs/files/', '') : 'None';

    const lastRun = last20[last20.length - 1];
    const unowned = (lastRun && lastRun.ownership && lastRun.ownership.unowned_count) || 0;

    const { getActiveProfile } = require('./lib/onboarding/governance-profiles');
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
    log(`[API] Error: ${e.message}`, 'error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- END TREND API ROUTES ---

const AGENT_MAP = {
  // Sanskrit Personas
  'Sutradhar': './agents/Sutradhar.js',
  'Tark': './agents/Tark.js',
  'Shilpi': './agents/Shilpi.js',
  'TestAgent': './agents/TestAgent.js',
  'Guru': './agents/Guru.js',
  'Koshpal': './agents/Koshpal.js',
  'Rakshak': './agents/Rakshak.js',
  'Vishwakarma': './agents/Vishwakarma.js',
  'InfraLead': './agents/Vishwakarma.js',
  'Shishya': './agents/Shishya.js'
};

const RUNNING_PROCESSES = Object.create(null); // { "Tark": <ChildProcess> }
const SPAWN_TIMES = Object.create(null); // { "Tark": <Timestamp> }
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
let lastMessageId = 0;

// Security: Input Validation Limits
const MAX_MESSAGE_LENGTH = 10000; // 10KB
const MAX_PROMPT_LENGTH = 20000; // 20KB

// Broadcast logs to connected clients & write to file
function log(msg, level = 'info') {
  if (LOG_LEVEL === 'silent') return;
  if (LOG_LEVEL === 'error' && level !== 'error') return;

  const logMsg = `[SUTRADHAR] ${msg}`;

  // Write to setu.log (primary log destination)
  logStream.write(logMsg + '\n');

  // Broadcast to dashboard via socket
  io.emit('log', logMsg);
}

function debug(msg) {
  if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'verbose') {
    log(`[DEBUG] ${msg}`, 'debug');
  }
}

// 1. Spawn an Agent
function spawnAgent(name, role) {
  const scriptPath = AGENT_MAP[role];
  if (!scriptPath || typeof scriptPath !== 'string') {
    log(`❌ Unknown Role: ${role} for Agent: ${name}`);
    return;
  }

  log(`🚀 Spawning ${name} (${role})...`);
  debug(`Agent path resolve: ${path.resolve(__dirname, scriptPath)}`);

  const child = fork(path.resolve(__dirname, scriptPath), [name, role], {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
    env: { ...process.env, LOG_LEVEL: LOG_LEVEL }
  });

  const agentLogRegex = new RegExp(`^\\[${name}\\]\\s*`);

  // Pipe Agent Logs to Main Console & Dashboard
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(l => {
      // Hide internal agent logging if it already contains the agent name to avoid double prefix
      const cleanLine = l.replace(agentLogRegex, '');
      log(`[${name}] ${cleanLine}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(l => {
      const cleanLine = l.replace(agentLogRegex, '');
      log(`[${name}] ❌ ${cleanLine}`, 'error');
    });
  });

  RUNNING_PROCESSES[name] = child;
  SPAWN_TIMES[name] = Date.now();

  child.on('exit', (code) => {
    log(`⚠️ Agent ${name} exited with code ${code}`);
    delete RUNNING_PROCESSES[name];

    // Broadcast Crash Event for Guru (Death Learning)
    bus.send('System', 'ALL', `Agent ${name} crashed`, 'event', {
      type: 'AGENT_CRASH',
      agentName: name,
      reason: `Exited with code ${code}`,
      timestamp: Date.now()
    });

    // We let the Resurrection Loop handle the restart
  });
}

// 1.5 The Human Gate (Prompt)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

bus.on('message', (msg) => {
  // NOTE: We do NOT emit 'chat_message' here anymore to avoid duplicates with the polling loop.
  // The polling loop handles broadcasting ALL messages (local & remote).

  // Brain: Sutradhar is now an independent agent.
  // We no longer intercept 'chat' to Sutradhar here.
  // The message poller broadcasts it, and the Sutradhar process picks it up.

  if (msg.type === 'escalation' && msg.recipient === 'Sutradhar') {
    log(`🚨 HUMAN GATE TRIGGERED: ${msg.content}`);
    rl.question('[SUTRADHAR] ❓ Approve this high-impact change? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        log('✅ Human approval received. Notifying Shishya...');
        bus.send('Sutradhar', msg.meta.originalSender, '✅ Human approval granted. Proceed.', 'approval', { taskId: msg.meta.taskId });
      } else {
        log('🛑 Human rejection. Notifying Shishya...');
        bus.send('Sutradhar', msg.meta.originalSender, '❌ Human rejected this plan. Revise strictly.', 'rejection', { taskId: msg.meta.taskId });
      }
    });
  }
});

// Sutradhar Intelligence
// Sutradhar Intelligence moved to agents/Sutradhar.js

// Socket.IO Events
io.on('connection', (socket) => {
  log(`🔌 Client connected: ${socket.id}`);

  // Send initial state
  const agents = bus.getAgents();
  socket.emit('agents_update', agents);

  const tasks = bus.getTasks();
  socket.emit('tasks_update', tasks);

  // Send recent logs from setu.log if exists
  const logFile = path.join(__dirname, 'setu.log');
  readLastLines(logFile, 50)
    .then((lines) => {
      const logs = lines.filter((l) => l.trim());
      if (logs.length > 0) socket.emit('log_history', logs);
    })
    .catch(() => { });

  // Send Chat History (STRUCTURED)
  try {
    const chatHistory = bus.db.prepare(`
      SELECT * FROM messages 
      WHERE type = 'chat' 
      ORDER BY id ASC
    `).all(); // All messages, oldest first
    socket.emit('chat_history', chatHistory);
  } catch (e) {
    console.error('Failed to fetch chat history', e);
  }

  // Handle incoming chat messages from Dashboard Socket (Alternate to HTTP API)
  socket.on('chat_message', (msg) => {
    log(`💬 Socket Message: ${msg.content || msg.message} (To: ${msg.recipient || msg.agent})`);

    // Support both formats { recipient, content } and { agent, message }
    const sender = msg.sender || 'User';
    const recipient = msg.recipient || msg.agent || 'Sutradhar';
    const content = msg.content || msg.message;

    if (content) {
      bus.send(sender, recipient, content, 'chat', msg.meta || {});
    }
  });

  socket.on('disconnect', () => {
    log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// 2. Resurrection Loop (The Reaper) & Message Poller
function startSystemLoops() {
  let lastTasksState = { t: 0, c: 0 };
  let lastAgentsJson = '';
  let lastAgentBroadcast = Date.now();

  // Initialize lastMessageId to the latest message to avoid re-broadcasting old history on boot
  // Or should we? Maybe recent history is good.
  // Let's just catch new ones.
  try {
    const lastMsg = bus.db.prepare('SELECT id FROM messages ORDER BY id DESC LIMIT 1').get();
    lastMessageId = lastMsg ? lastMsg.id : 0;
  } catch (e) {
    lastMessageId = 0;
  }

  setInterval(() => {
    // debug('--- System Loop Pulse ---');
    // 0. Initial Signal for Unread Messages (Only on first run or periodically)
    // Actually, the resurrection loop handles spawning. 
    // Let's just ensure unread messages are signaled once agents are up.
    if (Date.now() - lastAgentBroadcast < 2000) { // Using this as a proxy for "just started or resurrected"
      const unread = bus.db.prepare("SELECT recipient FROM messages WHERE read_at IS NULL GROUP BY recipient").all();
      unread.forEach(u => {
        if (u.recipient === 'ALL') {
          Object.values(RUNNING_PROCESSES).forEach(proc => {
            try { proc.send({ type: 'new_message' }); } catch (e) { }
          });
        } else if (RUNNING_PROCESSES[u.recipient]) {
          try { RUNNING_PROCESSES[u.recipient].send({ type: 'new_message' }); } catch (e) { }
        }
      });
    }
    // A. Resurrection Logic (Optimized: Targeted Query)
    const deadAgents = bus.getDeadAgents(30);
    let resurrectionOccurred = false;

    if (deadAgents.length > 0) {
      deadAgents.forEach(agent => {
        // GUARD: Only resurrect agents that exist in our AGENT_MAP (prevents test-injected zombies)
        if (!AGENT_MAP[agent.role]) {
          debug(`🧹 Skipping unknown agent '${agent.name}' (role: ${agent.role}). Cleaning from DB.`);
          bus._stmt('deleteAgentByName', 'DELETE FROM agents WHERE name = ?').run(agent.name);
          return;
        }

        // CRITICAL: Check grace period to avoid "Murder Loops"
        const now = Date.now();
        const lastSpawn = SPAWN_TIMES[agent.name] || 0;
        const elapsed = (now - lastSpawn) / 1000;

        if (elapsed < 30) {
          debug(`⌛ Agent ${agent.name} is in Grace Period (${Math.round(elapsed)}s). Skipping resurrection.`);
          return;
        }

        log(`💀 Agent ${agent.name} is dead (${Math.round(elapsed)}s since last spawn). Resurrecting...`);
        resurrectionOccurred = true;

        // Kill if process still exists but zombie
        if (RUNNING_PROCESSES[agent.name]) {
          RUNNING_PROCESSES[agent.name].kill();
        }
        // Respawn
        spawnAgent(agent.name, agent.role);
      });
    }

    // Broadcast Agents (Throttled + On Resurrection)
    const now = Date.now();
    // Throttle to every 2 seconds unless a critical event happened
    if (resurrectionOccurred || (now - lastAgentBroadcast > 2000)) {
      const currentAgents = bus.getAgents();

      // ⚡ Optimization: Filter out high-frequency noise (heartbeats) from change detection
      // The frontend only cares about status/role/pid changes, not the exact heartbeat timestamp.
      const leanAgents = currentAgents.map(({ last_heartbeat, ...rest }) => rest);
      const leanAgentsJson = JSON.stringify(leanAgents);

      if (leanAgentsJson !== lastAgentsJson) {
        io.emit('agents_update', currentAgents);
        lastAgentsJson = leanAgentsJson;
      }
      lastAgentBroadcast = now;
    }

    // B. Tasks Broadcast (only if changed)
    const taskMeta = bus.getTaskMeta();
    if (!taskMeta || taskMeta.t !== lastTasksState.t || taskMeta.c !== lastTasksState.c) {
      const currentTasks = bus.getTasks();
      io.emit('tasks_update', currentTasks);
      lastTasksState = taskMeta || { t: 0, c: 0 };
    }

    // C. Message Polling (The Pulse)
    const newMessages = bus.getNewMessages(lastMessageId);

    if (newMessages.length > 0) {
      newMessages.forEach(msg => {
        // Parse meta if needed, but bus.send stores it as string in DB?
        // lib/db.js: JSON.stringify(meta) -> stored in DB as TEXT.
        // We need to parse it back before sending to frontend? 
        // Better-sqlite3 returns TEXT columns as strings.
        try {
          if (typeof msg.meta === 'string') msg.meta = JSON.parse(msg.meta);
        } catch (e) { }

        if (['chat', 'status', 'tool_start', 'tool_end', 'thought_start', 'thought_end', 'context_compact_start', 'context_compact_end'].includes(msg.type) || msg.recipient === 'ALL') {
          const truncatedContent = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content;
          log(`[${msg.type.toUpperCase()}] [${msg.sender}] ${truncatedContent}`);
        }

        // Sutradhar is now an agent, so we don't handle it here manually.

        io.emit('chat_message', msg);
        lastMessageId = msg.id;

        // ⚡ OPTIMIZATION: Push Notification via IPC (Avoid N+1 Polling)
        if (msg.recipient === 'ALL') {
          Object.values(RUNNING_PROCESSES).forEach(proc => {
            try { proc.send({ type: 'new_message' }); } catch (e) { }
          });
        } else if (RUNNING_PROCESSES[msg.recipient]) {
          try { RUNNING_PROCESSES[msg.recipient].send({ type: 'new_message' }); } catch (e) { }
        }
      });
    }

    // E. SUTRADHAR Heartbeat (Kernel Persistence)
    // E. Sutradhar is now a separate process, so no kernel heartbeat for it.

  }, 1000); // Check every 1s (High frequency for responsiveness)
  // D. Log File Watcher REMOVED
  // Reason: The `log()` function already broadcasts logs via Socket.IO immediately.
  // Watching the file caused duplicate log emissions (one from `log()`, one from `fs.watch`).
  // External tools can still tail `setu.log` if needed.
}

// 3. Boot
function boot() {
  // Clear stale logs for fresh start
  try {
    fs.appendFileSync(path.join(__dirname, 'setu.log'), `\n[SUTRADHAR] Mission Control Booting at ${new Date().toISOString()}\n`);
  } catch (e) { }

  log('Starting System Kernel...');
  debug(`Environment LOG_LEVEL: ${LOG_LEVEL}`);

  // 1. PURGE LEGACY AGENTS (Deep Clean)
  log('🧹 Purging legacy agent registry...');
  bus.db.prepare('DELETE FROM agents').run();

  // 2. SEED SANSKRIT SWARM (The Core Swarm)
  const seedAgents = [
    { name: 'Sutradhar', role: 'Sutradhar' },
    { name: 'Tark', role: 'Tark' },
    { name: 'Shilpi', role: 'Shilpi' },
    { name: 'Guru', role: 'Guru' },
    { name: 'Shishya', role: 'Shishya' },
    { name: 'Koshpal', role: 'Koshpal' },
    { name: 'Rakshak', role: 'Rakshak' },
    { name: 'Vishwakarma', role: 'Vishwakarma' }
  ];

  seedAgents.forEach(a => {
    log(`✨ Seeding & Spawning Agent: ${a.name} (${a.role})`);
    spawnAgent(a.name, a.role);
  });

  // Start Loops (Resurrection will pick up the seeded agents)
  startSystemLoops();

  // Start HTTP Server
  const HOST = process.env.HOST || '127.0.0.1';
  server.listen(PORT, HOST, () => {
    log(`🌍 Server running on http://${HOST}:${PORT}`);
    log(`📡 Socket.IO listening on port ${PORT}`);
    debug('Dashboard API ready (merged from lib/server.js)');
  });
}

// Handle Startup
boot();

// Graceful Shutdown
function shutdown() {
  log('🛑 Shutting down Setu Kernel...');

  Object.entries(RUNNING_PROCESSES).forEach(([name, child]) => {
    log(`💀 Killing Agent: ${name} (PID: ${child.pid})`);
    child.kill();
  });

  server.close(() => {
    log('🌍 HTTP Server closed.');
    logStream.end(() => {
      process.exit(0);
    });
  });

  // Force exit if hanging
  setTimeout(() => process.exit(1), 2000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
