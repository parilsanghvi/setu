const { fork } = require('child_process');
const path = require('path');
const bus = require('./lib/db');
const readline = require('readline');

// 👑 SUTRADHAR: The Orchestrator (formerly Narad)
const AGENT_MAP = {
  'Tark': './agents/Tark.js',
  'Shilpi': './agents/Shilpi.js',
  'TestAgent': './agents/TestAgent.js',
  'Guru': './agents/Guru.js',
  'Koshpal': './agents/Koshpal.js',
  'Vishwakarma': './agents/Vishwakarma.js',
  'InfraLead': './agents/Vishwakarma.js',
  'Shishya': './agents/Shishya.js'
};

const RUNNING_PROCESSES = {}; // { "Tark": <ChildProcess> }

function log(msg) {
  console.log(`[SUTRADHAR] ${msg}`);
}

// 1. Spawn an Agent
function spawnAgent(name, role) {
  const scriptPath = AGENT_MAP[role];
  if (!scriptPath) {
    log(`❌ Unknown Role: ${role} for Agent: ${name}`);
    return;
  }

  log(`🚀 Spawning ${name} (${role})...`);

  const child = fork(path.resolve(__dirname, scriptPath), [name, role], {
    stdio: 'inherit' // Pipe logs to main console
  });

  RUNNING_PROCESSES[name] = child;

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

// 2. Resurrection Loop (The Reaper)
function startResurrectionLoop() {
  setInterval(() => {
    const deadAgents = bus.getDeadAgents(10); // 10s timeout for testing (usually 30s)

    if (deadAgents.length > 0) {
      log(`💀 Found ${deadAgents.length} dead agents. Resurrecting...`);
      deadAgents.forEach(agent => {
        // Kill if process still exists but zombie
        if (RUNNING_PROCESSES[agent.name]) {
          RUNNING_PROCESSES[agent.name].kill();
        }
        // Respawn
        spawnAgent(agent.name, agent.role);
      });
    }
  }, 5000); // Check every 5s
}

// 3. Boot
function boot() {
  log('Starting System Kernel...');

  // Clean start? For now, let's just spawn a TestAgent if none exist
  // In real app, we might read specific config
  const existing = bus.db.prepare('SELECT count(*) as count FROM agents').get();

  if (existing.count === 0) {
    log('No agents found. Seeding TestAgent...');
    spawnAgent('TestAgent-1', 'TestAgent');
  } else {
    log('Resuming existing agents...');
    // The resurrection loop will pick them up if they are dead!
  }

  // Ensure Guru is running
  const guru = bus.db.prepare("SELECT * FROM agents WHERE name = 'Guru'").get();
  if (!guru) {
    log('Awakening Guru...');
    spawnAgent('Guru', 'Guru');
    bus.heartbeat('Guru', 'Guru', null, 'OFFLINE'); // Seed DB
  }

  startResurrectionLoop();
}

// Handle Startup
boot();
