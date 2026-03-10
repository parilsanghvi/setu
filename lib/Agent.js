const path = require('path');
const EventEmitter = require('events');
const Logger = require('./Logger');

const HEARTBEAT_INTERVAL_MS = 5000;
const BACKUP_POLL_INTERVAL_MS = 60000;

/**
 * The Base Agent Class
 * Represents a persistent worker in the swarm.
 */
class Agent extends EventEmitter {
  /**
   * @param {string} name - Unique ID (e.g., "Backend-Lead", "Intern-101")
   * @param {string} role - "Lead" or "Intern"
   * @param {string} scope - Root directory for this agent (e.g., "/backend")
   * @param {object} bus - The event bus implementation (defaults to lib/db.js)
   */
  constructor(name, role, scope, bus = require('./db')) {
    super(); // Initialize EventEmitter
    this.name = name;
    this.role = role;
    this.scope = scope ? path.resolve(scope) : process.cwd();
    this.status = 'IDLE';
    this.pid = process.pid;
    this.heartbeatInterval = null;
    this.logger = new Logger(name);
    this.bus = bus;
    this.bootTime = Math.floor(Date.now() / 1000);
    this.lastCrashTime = 0;
    this.crashCount = 0;
  }

  /**
   * 🟢 LIFECYCLE: Boot
   */
  boot() {
    this.logger.info(`Booting up (PID: ${this.pid}, Scope: ${this.scope})...`);

    // 1. Register
    this.bus.heartbeat(this.name, this.role, this.pid, 'IDLE');

    // 2. Heartbeat Loop
    this.heartbeatInterval = setInterval(() => {
      this.bus.heartbeat(this.name, this.role, this.pid, this.status);
    }, HEARTBEAT_INTERVAL_MS);

    // 3. Signals
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));

    // 4. Listen
    this.listen();

    // 5. Announce Presence
    setTimeout(() => {
      this.speak('ALL', `🙏 Namaste! ${this.name} (${this.role}) is initialized and standing by.`, 'status', { status: 'READY' });
    }, 1000);
  }

  listen() {
    // ⚡ Optimized Polling: IPC + Backup Timer
    // Instead of polling constantly (N+1), we wait for a 'new_message' signal from the Orchestrator.
    // This reduces DB load significantly in idle states.

    // 1. IPC Handler (The Push)
    process.on('message', (msg) => {
      if (msg && msg.type === 'new_message') {
        this.checkForMessages();
      }
    });

    // 2. Initial Check (Boot)
    this.checkForMessages();

    // 3. Backup Polling (The Safety Net) - Every 60s instead of 1s
    this.listenInterval = setInterval(() => this.checkForMessages(), BACKUP_POLL_INTERVAL_MS);
  }

  async checkForMessages() {
    try {
      const messages = this.bus.getUnread(this.name);
      if (messages.length > 0) {
        this.logger.info(`📨 FOUND ${messages.length} messages.`);
        this.status = 'BUSY';
        this.bus.heartbeat(this.name, this.role, this.pid, this.status);

        for (const msg of messages) {
          if (msg.sender === this.name) continue;
          if (msg.type === 'status') continue;

          this.logger.info(`🧠 Processing msg ${msg.id} (${msg.type}): ${msg.content.substring(0, 20)}`);

          // Handle System Events
          if (msg.type === 'event' && msg.meta?.type === 'MISSION_COMPLETE') {
            this.logger.info(`🚀 Mission complete signal received. Entering STANDBY.`);
            this.status = 'STANDBY';
            this.bus.heartbeat(this.name, this.role, this.pid, this.status);
            continue;
          }

          // User messages wake the agent up from STANDBY
          if (msg.sender === 'User' && this.status === 'STANDBY') {
            this.status = 'IDLE';
          }

          try {
            await this.processMessage(msg);
          } catch (innerError) {
            this.logger.error(`❌ Error processing message ${msg.id}:`, innerError);
          }
        }

        this.bus.markRead(messages.map(m => m.id));
        this._setIdle();
      }
    } catch (e) {
      this.logger.error(`❌ Message Polling Error:`, e);
      // We don't die, just wait for next tick
    }
  }

  _setIdle() {
    this.status = 'IDLE';
    this.bus.heartbeat(this.name, this.role, this.pid, this.status);
  }

  async processMessage(msg) {
    // Default: Just log if needed. No auto-echo to prevent loops.
  }

  speak(recipient, content, type = 'chat', meta = {}) {
    this.bus.send(this.name, recipient, content, type, meta);
  }

  shutdown(signal) {
    this.logger.info(`Shutting down (${signal})...`);
    clearInterval(this.heartbeatInterval);
    clearInterval(this.listenInterval);
    this.bus.heartbeat(this.name, this.role, this.pid, 'OFFLINE');
    this.emit('shutdown', signal);
  }
}

module.exports = Agent;
