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
const LLM = require('./lib/LLM');

// 👑 SUTRADHAR: The Orchestrator (formerly Narad)
const PORT = 3000;
const app = express();
const server = http.createServer(app);

// Security Headers & CORS
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve Static Files (Production Build & Screenshots)
const frontendDist = path.join(__dirname, 'frontend/app/dist');
app.use(express.static(frontendDist));
app.use('/screenshots', express.static(path.join(__dirname, 'frontend/dashboard/screenshots'), { index: false }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// --- DASHBOARD API ROUTES ---

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
    res.status(500).json({ error: e.message });
  }
});

// API: Tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = bus.db.prepare('SELECT * FROM tasks ORDER BY updated_at DESC').all();
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Agents
app.get('/api/agents', (req, res) => {
  try {
    const agents = bus.db.prepare('SELECT * FROM agents').all();
    res.json(agents);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Create Task
app.post('/api/tasks', (req, res) => {
  const { title, type } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const id = `TASK-${Date.now().toString().slice(-4)}`;
  bus.updateTask(id, 'TODO', { title, type: type || 'generic', created_at: new Date().toISOString() });

  res.json({ id, status: 'TODO' });
});

// API: Get Screenshots for Task
app.get('/api/tasks/:id/screenshots', (req, res) => {
  const taskId = req.params.id;
  const screenshotDir = path.join(__dirname, 'frontend/dashboard/screenshots', taskId);

  if (!fs.existsSync(screenshotDir)) {
    return res.json([]);
  }

  try {
    const files = fs.readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
    const urls = files.map(f => `/screenshots/${taskId}/${f}`);
    res.json(urls);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Chat with Agent
app.post('/api/chat', (req, res) => {
  const { agent, message } = req.body;
  if (!agent || !message) return res.status(400).json({ error: 'Agent and Message required' });

  bus.send('User', agent, message, 'chat', { via: 'gui' });
  res.json({ status: 'sent', to: agent });
});

// --- END DASHBOARD API ROUTES ---

const AGENT_MAP = {
  // Sanskrit Personas
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

const RUNNING_PROCESSES = {}; // { "Tark": <ChildProcess> }
const SPAWN_TIMES = {}; // { "Tark": <Timestamp> }
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
let lastMessageId = 0;

// Broadcast logs to connected clients & write to file
function log(msg, level = 'info') {
  if (LOG_LEVEL === 'silent') return;
  if (LOG_LEVEL === 'error' && level !== 'error') return;

  const logMsg = `[SUTRADHAR] ${msg}`;
  console.log(logMsg);

  // Also write to setu.log for Dashboard consistency
  try {
    fs.appendFileSync(path.join(__dirname, 'setu.log'), logMsg + '\n');
  } catch (e) { }

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
  if (!scriptPath) {
    log(`❌ Unknown Role: ${role} for Agent: ${name}`);
    return;
  }

  log(`🚀 Spawning ${name} (${role})...`);
  debug(`Agent path resolve: ${path.resolve(__dirname, scriptPath)}`);

  const child = fork(path.resolve(__dirname, scriptPath), [name, role], {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
    env: { ...process.env, LOG_LEVEL: LOG_LEVEL }
  });

  // Pipe Agent Logs to Main Console & Dashboard
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(l => {
      // Hide internal agent logging if it already contains the agent name to avoid double prefix
      const cleanLine = l.replace(new RegExp(`^\\[${name}\\]\\s*`), '');
      log(`[${name}] ${cleanLine}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(l => {
      const cleanLine = l.replace(new RegExp(`^\\[${name}\\]\\s*`), '');
      log(`[${name}] ❌ ${cleanLine}`, 'error');
    });
  });

  RUNNING_PROCESSES[name] = child;
  SPAWN_TIMES[name] = Date.now();

  child.on('exit', (code) => {
    log(`⚠️ Agent ${name} exited with code ${code}`);
    delete RUNNING_PROCESSES[name];
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

  // Brain: Process messages sent to Sutradhar
  if (msg.type === 'chat' && msg.recipient === 'Sutradhar') {
    handleSutradharChat(msg);
  }

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
async function handleSutradharChat(msg) {
  log(`🧠 Sutradhar thinking about: ${msg.content}`);
  debug(`Sutradhar received message from: ${msg.sender}`);
  const systemPrompt = `You are Sutradhar, the divine director of this AI swarm. 
Your goal is to coordinate the Sanskrit swarm (Tark, Shilpi, Guru) to fulfill the user's mission.
Tark: Logic/Backend Lead.
Shilpi: Creative/Frontend Builder.
Guru: Skill/Knowledge master.
When the user gives a command, you should respond as Sutradhar and either provide a high-level plan or delegate specific sub-tasks to Tark, Shilpi, or Guru by instructing the user or the system on what will happen next.
Keep responses concise, premium, and in character (Sanskrit-themed wisdom).`;

  try {
    debug('Calling LLM.generate for Sutradhar...');
    const response = await LLM.generate(systemPrompt, msg.content);
    debug(`Sutradhar generated response: ${response.substring(0, 50)}...`);
    const msgId = bus.send('Sutradhar', msg.sender, response, 'chat');
    debug(`Sutradhar message sent to DB. ID: ${msgId}`);
    // Mark the incoming message as read
    bus.markRead([msg.id]);
  } catch (e) {
    log(`❌ Sutradhar Brain Error: ${e.message}`, 'error');
    console.error(e);
    bus.send('Sutradhar', msg.sender, "The cosmos is clouded. I cannot process this mission segment right now.", 'chat');
  }
}

// Socket.IO Events
io.on('connection', (socket) => {
  log(`🔌 Client connected: ${socket.id}`);

  // Send initial state
  const agents = bus.db.prepare('SELECT * FROM agents').all();
  socket.emit('agents_update', agents);

  const tasks = bus.db.prepare('SELECT * FROM tasks').all();
  socket.emit('tasks_update', tasks);

  // Send recent logs from setu.log if exists
  const logFile = path.join(__dirname, 'setu.log');
  if (fs.existsSync(logFile)) {
    try {
      const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(l => l.trim()).slice(-50);
      socket.emit('log_history', logs);
    } catch (e) { }
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
    // A. Resurrection Logic (with 30s Grace Period)
    const deadAgents = bus.getDeadAgents(30);

    if (deadAgents.length > 0) {
      deadAgents.forEach(agent => {
        // CRITICAL: Check grace period to avoid "Murder Loops"
        const now = Date.now();
        const lastSpawn = SPAWN_TIMES[agent.name] || 0;
        const elapsed = (now - lastSpawn) / 1000;

        if (elapsed < 30) {
          debug(`⌛ Agent ${agent.name} is in Grace Period (${Math.round(elapsed)}s). Skipping resurrection.`);
          return;
        }

        log(`💀 Agent ${agent.name} is dead (${Math.round(elapsed)}s since last spawn). Resurrecting...`);

        // Kill if process still exists but zombie
        if (RUNNING_PROCESSES[agent.name]) {
          RUNNING_PROCESSES[agent.name].kill();
        }
        // Respawn
        spawnAgent(agent.name, agent.role);
      });
    }

    // B. State Broadcast
    const currentAgents = bus.db.prepare('SELECT * FROM agents').all();
    io.emit('agents_update', currentAgents);

    const currentTasks = bus.db.prepare('SELECT * FROM tasks').all();
    io.emit('tasks_update', currentTasks);

    // C. Message Polling (The Pulse)
    const newMessages = bus.db.prepare('SELECT * FROM messages WHERE id > ? ORDER BY id ASC').all(lastMessageId);

    if (newMessages.length > 0) {
      newMessages.forEach(msg => {
        // Parse meta if needed, but bus.send stores it as string in DB?
        // lib/db.js: JSON.stringify(meta) -> stored in DB as TEXT.
        // We need to parse it back before sending to frontend? 
        // Better-sqlite3 returns TEXT columns as strings.
        try {
          if (typeof msg.meta === 'string') msg.meta = JSON.parse(msg.meta);
        } catch (e) { }

        if (msg.type === 'chat' || msg.recipient === 'ALL' || msg.type === 'status') {
          log(`[CHAT] [${msg.sender}] ${msg.content}`);
        }

        io.emit('chat_message', msg);
        lastMessageId = msg.id;
      });
    }

    // E. SUTRADHAR Heartbeat (Kernel Persistence)
    bus.heartbeat('Sutradhar', 'Sutradhar', process.pid, 'IDLE');

  }, 1000); // Check every 1s (High frequency for responsiveness)

  // D. Log File Watcher (Stream setu.log to GUI)
  const logFile = path.join(__dirname, 'setu.log');
  if (fs.existsSync(logFile)) {
    let fileSize = fs.statSync(logFile).size;
    fs.watchFile(logFile, { interval: 500 }, (curr, prev) => {
      if (curr.size > prev.size) {
        const stream = fs.createReadStream(logFile, { start: prev.size, end: curr.size });
        stream.on('data', (chunk) => {
          io.emit('log', chunk.toString());
        });
      }
    });
  }
}

// 3. Boot
function boot() {
  // Clear stale logs for fresh start
  try {
    fs.writeFileSync(path.join(__dirname, 'setu.log'), `[SUTRADHAR] Mission Control Booting at ${new Date().toISOString()}\n`);
  } catch (e) { }

  log('Starting System Kernel...');
  debug(`Environment LOG_LEVEL: ${LOG_LEVEL}`);

  // 1. PURGE LEGACY AGENTS (Deep Clean)
  log('🧹 Purging legacy agent registry...');
  bus.db.prepare('DELETE FROM agents').run();

  // 2. SEED SANSKRIT SWARM (The Core Four)
  const seedAgents = [
    { name: 'Sutradhar', role: 'Sutradhar' }, // Managed via index.js directly, but useful in DB
    { name: 'Tark', role: 'Tark' },
    { name: 'Shilpi', role: 'Shilpi' },
    { name: 'Guru', role: 'Guru' }
  ];

  seedAgents.forEach(a => {
    if (a.name === 'Sutradhar') {
      bus.heartbeat(a.name, a.role, process.pid, 'IDLE');
    } else {
      bus.heartbeat(a.name, a.role, null, 'OFFLINE');
    }
    log(`✨ Seeded Agent: ${a.name} (${a.role})`);
  });

  // Start Loops (Resurrection will pick up the seeded agents)
  startSystemLoops();

  // Start HTTP Server
  server.listen(PORT, () => {
    log(`🌍 Server running on http://localhost:${PORT}`);
    log(`📡 Socket.IO listening on port ${PORT}`);
    debug('Dashboard API ready (merged from lib/server.js)');
  });
}

// Handle Startup
boot();
