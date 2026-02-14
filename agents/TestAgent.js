const Agent = require('../lib/Agent');

class TestAgent extends Agent {
    constructor(name, role) {
        super(name, role, null);
    }

    async processMessage(msg) {
        console.log(`[${this.name}] Test Message received:`, msg);
        if (msg.content === 'PING') {
            this.speak(msg.sender, 'PONG');
        }
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new TestAgent(name, role);
    agent.boot();
}

module.exports = TestAgent;
