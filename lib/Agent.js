const bus = require('./db');
const path = require('path');
const EventEmitter = require('events');
const Logger = require('./Logger');

/**
 * The Base Agent Class
 * Represents a persistent worker in the swarm.
 */
class Agent extends EventEmitter {
  /**
   * @param {string} name - Unique ID (e.g., "Backend-Lead", "Intern-101")
   * @param {string} role - "Lead" or "Intern"
   * @param {string} scope - Root directory for this agent (e.g., "/backend")
   */
  constructor(name, role, scope) {
    super(); // Initialize EventEmitter
    this.name = name;
    this.role = role;
    this.scope = scope ? path.resolve(scope) : process.cwd();
    this.status = 'IDLE';
    this.pid = process.pid;
    this.heartbeatInterval = null;
    this.logger = new Logger(name);
  }

  /**
   * 🟢 LIFECYCLE: Boot
   */
  boot() {
    this.logger.info(`Booting up (PID: ${this.pid}, Scope: ${this.scope})...`);

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

    // 5. Announce Presence
    setTimeout(() => {
      this.speak('ALL', `🙏 Namaste! ${this.name} (${this.role}) is initialized and standing by.`, 'status', { status: 'READY' });
    }, 1000);
  }

  listen() {
    this.listenInterval = setInterval(() => {
      try {
        const messages = bus.getUnread(this.name);
        if (messages.length > 0) {
          this.status = 'BUSY';
          // Initial heartbeat to show we are starting work
          bus.heartbeat(this.name, this.role, this.pid, this.status);

          messages.forEach(msg => {
            // CRITICAL: Don't process our own messages
            if (msg.sender === this.name) return;

            // Skip status broadcasts — they don't need LLM processing
            // (prevents cascading "I'm online" storms that waste tokens)
            if (msg.type === 'status') return;

            // Handle System Events
            if (msg.type === 'event') {
              if (msg.meta?.type === 'MISSION_COMPLETE') {
                this.logger.info(`🚀 Mission complete signal received. Entering STANDBY.`);
                this.status = 'STANDBY';
                bus.heartbeat(this.name, this.role, this.pid, this.status);
                return;
              }
            }

            // User messages wake the agent up from STANDBY
            if (msg.sender === 'User' && this.status === 'STANDBY') {
              this.status = 'IDLE';
            }

            try {
              this.processMessage(msg);
            } catch (innerError) {
              this.logger.error(`❌ Error processing message ${msg.id}:`, innerError);
            }
          });

          bus.markRead(messages.map(m => m.id));
          this.status = 'IDLE';
          bus.heartbeat(this.name, this.role, this.pid, this.status);
        }
      } catch (e) {
        this.logger.error(`❌ Message Polling Error:`, e);
        // We don't die, just wait for next tick
      }
    }, 1000);
  }

  async processMessage(msg) {
    // Default: Just log if needed. No auto-echo to prevent loops.
  }

  speak(recipient, content, type = 'chat', meta = {}) {
    bus.send(this.name, recipient, content, type, meta);
  }

  shutdown(signal) {
    this.logger.info(`Shutting down (${signal})...`);
    clearInterval(this.heartbeatInterval);
    clearInterval(this.listenInterval);
    bus.heartbeat(this.name, this.role, this.pid, 'OFFLINE');
    process.exit(0);
  }
}

module.exports = Agent;
