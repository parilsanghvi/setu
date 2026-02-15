const { fork } = require('child_process');
const path = require('path');
const bus = require('./lib/db');
const readline = require('readline');

// 👑 NARAD: The Orchestrator
const AGENT_MAP = {
  'BackendLead': './agents/BackendLead.js',
  'FrontendLead': './agents/FrontendLead.js',
  'TestAgent': './agents/TestAgent.js',
  'Drona': './agents/Drona.js'
};

const RUNNING_PROCESSES = {}; // { "BackendLead": <ChildProcess> }

function log(msg) {
  console.log(`[NARAD] ${msg}`);
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
  if (msg.type === 'escalation' && msg.recipient === 'Narad') {
    log(`🚨 HUMAN GATE TRIGGERED: ${msg.content}`);
    rl.question('[NARAD] ❓ Approve this high-impact change? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        log('✅ Human approval received. Notifying Intern...');
        bus.send('Narad', msg.meta.originalSender, '✅ Human approval granted. Proceed.', 'approval', { taskId: msg.meta.taskId });
      } else {
        log('🛑 Human rejection. Notifying Intern...');
        bus.send('Narad', msg.meta.originalSender, '❌ Human rejected this plan. Revise strictly.', 'rejection', { taskId: msg.meta.taskId });
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

  // Ensure Drona is running
  const drona = bus.db.prepare("SELECT * FROM agents WHERE name = 'Drona'").get();
  if (!drona) {
    log('Awakening Drona...');
    spawnAgent('Drona', 'Drona');
    bus.heartbeat('Drona', 'Drona', null, 'OFFLINE'); // Seed DB
  }

  startResurrectionLoop();
}

// Handle Startup
boot();
