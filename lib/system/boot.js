const fs = require('fs');
const path = require('path');
const bus = require('../db');
const { log, debug, setIo, logStream } = require('./logger');
const { spawnAgent, startSystemLoops, RUNNING_PROCESSES } = require('./agentManager');
const DashboardServer = require('../server');

let dashboardServer;
let systemLoopsInterval;

// 3. Boot
function boot() {
  // Clear stale logs for fresh start
  try {
    fs.appendFileSync(path.join(__dirname, '../../setu.log'), `\n[SUTRADHAR] Mission Control Booting at ${new Date().toISOString()}\n`);
  } catch (e) { }

  log('Starting System Kernel...');
  debug(`Environment LOG_LEVEL: ${process.env.LOG_LEVEL || 'info'}`);

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

  // Start HTTP Server
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  dashboardServer = new DashboardServer(port);
  dashboardServer.start();

  // Provide io instance to logger for broadcasting
  setIo(dashboardServer.io);

  // Start Loops (Resurrection will pick up the seeded agents)
  systemLoopsInterval = startSystemLoops(dashboardServer.io);
}

// Graceful Terminate
function terminate() {
  log('🛑 Terminating Setu Kernel...');

  Object.entries(RUNNING_PROCESSES).forEach(([name, child]) => {
    log(`💀 Killing Agent: ${name} (PID: ${child.pid})`);
    child.kill();
  });

  if (systemLoopsInterval) {
      clearInterval(systemLoopsInterval);
  }

  if (dashboardServer) {
    dashboardServer.stop();
  }

  log('🌍 HTTP Server closed.');
  logStream.end(() => {
    process.exit(0);
  });

  // Force exit if hanging
  setTimeout(() => process.exit(1), 2000);
}

module.exports = {
    boot,
    terminate
};
