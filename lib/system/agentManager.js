const { fork } = require('child_process');
const path = require('path');
const bus = require('../db');
const { log, debug, LOG_LEVEL } = require('./logger');

const AGENT_MAP = {
  // Sanskrit Personas
  'Sutradhar': '../../agents/Sutradhar.js',
  'Tark': '../../agents/Tark.js',
  'Shilpi': '../../agents/Shilpi.js',
  'TestAgent': '../../agents/TestAgent.js',
  'Guru': '../../agents/Guru.js',
  'Koshpal': '../../agents/Koshpal.js',
  'Rakshak': '../../agents/Rakshak.js',
  'Vishwakarma': '../../agents/Vishwakarma.js',
  'InfraLead': '../../agents/Vishwakarma.js',
  'Shishya': '../../agents/Shishya.js'
};

const RUNNING_PROCESSES = Object.create(null); // { "Tark": <ChildProcess> }
const SPAWN_TIMES = Object.create(null); // { "Tark": <Timestamp> }
let lastMessageId = 0;

// Initialize lastMessageId to the latest message to avoid re-broadcasting old history on boot
try {
  const lastMsg = bus.db.prepare('SELECT id FROM messages ORDER BY id DESC LIMIT 1').get();
  lastMessageId = lastMsg ? lastMsg.id : 0;
} catch (e) {
  lastMessageId = 0;
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

// 2. Resurrection Loop (The Reaper) & Message Poller
function startSystemLoops(io) {
  let lastTasksState = { t: 0, c: 0 };
  let lastAgentsJson = '';
  let lastAgentBroadcast = Date.now();

  return setInterval(() => {
    // 0. Initial Signal for Unread Messages
    if (Date.now() - lastAgentBroadcast < 2000) {
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
    if (resurrectionOccurred || (now - lastAgentBroadcast > 2000)) {
      const currentAgents = bus.getAgents();
      const leanAgents = currentAgents.map(({ last_heartbeat, ...rest }) => rest);
      const leanAgentsJson = JSON.stringify(leanAgents);

      if (leanAgentsJson !== lastAgentsJson) {
        if (io) io.emit('agents_update', currentAgents);
        lastAgentsJson = leanAgentsJson;
      }
      lastAgentBroadcast = now;
    }

    // B. Tasks Broadcast (only if changed)
    const taskMeta = bus.getTaskMeta();
    if (!taskMeta || taskMeta.t !== lastTasksState.t || taskMeta.c !== lastTasksState.c) {
      const currentTasks = bus.getTasks();
      if (io) io.emit('tasks_update', currentTasks);
      lastTasksState = taskMeta || { t: 0, c: 0 };
    }

    // C. Message Polling (The Pulse)
    const newMessages = bus.getNewMessages(lastMessageId);

    if (newMessages.length > 0) {
      newMessages.forEach(msg => {
        try {
          if (typeof msg.meta === 'string') msg.meta = JSON.parse(msg.meta);
        } catch (e) { }

        if (['chat', 'status', 'tool_start', 'tool_end', 'thought_start', 'thought_end', 'context_compact_start', 'context_compact_end'].includes(msg.type) || msg.recipient === 'ALL') {
          const truncatedContent = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content;
          log(`[${msg.type.toUpperCase()}] [${msg.sender}] ${truncatedContent}`);
        }

        if (io) io.emit('chat_message', msg);
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

  }, 1000); // Check every 1s (High frequency for responsiveness)
}

module.exports = {
  AGENT_MAP,
  RUNNING_PROCESSES,
  SPAWN_TIMES,
  spawnAgent,
  startSystemLoops
};
