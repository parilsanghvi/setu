const bus = require('./db');
const path = require('path');

/**
 * The Base Agent Class
 * Represents a persistent worker in the swarm.
 */
class Agent {
  /**
   * @param {string} name - Unique ID (e.g., "Backend-Lead", "Intern-101")
   * @param {string} role - "Lead" or "Intern"
   * @param {string} scope - Root directory for this agent (e.g., "/backend")
   */
  constructor(name, role, scope) {
    this.name = name;
    this.role = role;
    this.scope = scope ? path.resolve(scope) : process.cwd();
    this.status = 'IDLE';
    this.pid = process.pid;
    this.heartbeatInterval = null;
  }

  /**
   * 🟢 LIFECYCLE: Boot
   */
  boot() {
    console.log(`[${this.name}] Booting up (PID: ${this.pid}, Scope: ${this.scope})...`);

    // 1. Register
    bus.heartbeat(this.name, this.role, this.pid, 'IDLE');

    // 2. Heartbeat Loop
    this.heartbeatInterval = setInterval(() => {
      bus.heartbeat(this.name, this.role, this.pid, this.status);
    }, 5000);

    // 3. Signals
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));

    // 4. Listen
    this.listen();
  }

  listen() {
    this.listenInterval = setInterval(() => {
      const messages = bus.getUnread(this.name);
      if (messages.length > 0) {
        this.status = 'BUSY';
        messages.forEach(msg => this.processMessage(msg));
        bus.markRead(messages.map(m => m.id));
        this.status = 'IDLE';
      }
    }, 1000);
  }

  async processMessage(msg) {
    console.log(`[${this.name}] Received: ${msg.content}`);
    if (msg.type === 'chat') {
      this.speak(msg.sender, `Echo: ${msg.content}`);
    }
  }

  speak(recipient, content, type = 'chat', meta = {}) {
    bus.send(this.name, recipient, content, type, meta);
  }

  shutdown(signal) {
    console.log(`[${this.name}] Shutting down (${signal})...`);
    clearInterval(this.heartbeatInterval);
    clearInterval(this.listenInterval);
    bus.heartbeat(this.name, this.role, this.pid, 'OFFLINE');
    process.exit(0);
  }
}

module.exports = Agent;
