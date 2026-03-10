const fs = require('fs');

const file = 'lib/Agent.js';
let content = fs.readFileSync(file, 'utf8');

const target = `  async checkForMessages() {
    try {
      const messages = this.bus.getUnread(this.name);
      if (messages.length > 0) {
        this.logger.info(\`📨 FOUND \${messages.length} messages.\`);
        this.status = 'BUSY';
        this.bus.heartbeat(this.name, this.role, this.pid, this.status);

        for (const msg of messages) {
          if (msg.sender === this.name) continue;
          if (msg.type === 'status') continue;

          this.logger.info(\`🧠 Processing msg \${msg.id} (\${msg.type}): \${msg.content.substring(0, 20)}\`);

          // Handle System Events
          if (msg.type === 'event') {
            if (msg.meta?.type === 'MISSION_COMPLETE') {
              this.logger.info(\`🚀 Mission complete signal received. Entering STANDBY.\`);
              this.status = 'STANDBY';
              this.bus.heartbeat(this.name, this.role, this.pid, this.status);
              continue;
            }
          }

          // User messages wake the agent up from STANDBY
          if (msg.sender === 'User' && this.status === 'STANDBY') {
            this.status = 'IDLE';
          }

          try {
            await this.processMessage(msg);
          } catch (innerError) {
            this.logger.error(\`❌ Error processing message \${msg.id}:\`, innerError);
          }
        }

        this.bus.markRead(messages.map(m => m.id));
        this._setIdle();
      }
    } catch (e) {
      this.logger.error(\`❌ Message Polling Error:\`, e);
      // We don't die, just wait for next tick
    }
  }`;

const replacement = `  async checkForMessages() {
    try {
      const messages = this.bus.getUnread(this.name);
      if (messages.length === 0) return;

      this.logger.info(\`📨 FOUND \${messages.length} messages.\`);
      this.status = 'BUSY';
      this.bus.heartbeat(this.name, this.role, this.pid, this.status);

      for (const msg of messages) {
        if (msg.sender === this.name) continue;
        if (msg.type === 'status') continue;

        this.logger.info(\`🧠 Processing msg \${msg.id} (\${msg.type}): \${msg.content.substring(0, 20)}\`);

        // Handle System Events
        if (msg.type === 'event') {
          if (msg.meta?.type === 'MISSION_COMPLETE') {
            this.logger.info(\`🚀 Mission complete signal received. Entering STANDBY.\`);
            this.status = 'STANDBY';
            this.bus.heartbeat(this.name, this.role, this.pid, this.status);
            continue;
          }
        }

        // User messages wake the agent up from STANDBY
        if (msg.sender === 'User' && this.status === 'STANDBY') {
          this.status = 'IDLE';
        }

        try {
          await this.processMessage(msg);
        } catch (innerError) {
          this.logger.error(\`❌ Error processing message \${msg.id}:\`, innerError);
        }
      }

      this.bus.markRead(messages.map(m => m.id));
      this._setIdle();
    } catch (e) {
      this.logger.error(\`❌ Message Polling Error:\`, e);
      // We don't die, just wait for next tick
    }
  }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content, 'utf8');
