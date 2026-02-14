const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const path = require('path');
const fs = require('fs');

class FrontendLead extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'frontend'));
        this.persona = "The Artist";
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🎨 Analyzing aesthetics... (Persona: ${this.persona})`);

        // 1. Persona Checks
        if (this.isUgly(msg.content)) {
            this.speak(msg.sender, `🤮 This looks generic. We are not building a Bootstrap MVP. Make it POP.`);
            return;
        }

        if (msg.content.includes('Tailwind')) {
            this.speak(msg.sender, `🛑 I forbid Tailwind. Use Vanilla CSS or I will reject the PR.`);
            return;
        }

        // 2. Commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Frontend Studio Initialized. 🖌️`);
        } else {
            this.speak(msg.sender, `Received. Validating pixels...`);
        }
    }

    isUgly(content) {
        // Simulating specific taste
        return content.includes('border: 1px solid black') || content.includes('Times New Roman');
    }

    initializeScope() {
        if (!fs.existsSync(this.scope)) {
            fs.mkdirSync(this.scope, { recursive: true });
        }
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Frontend Domain\n**Owner:** ${this.name}\n\n## Design System\n- Font: Inter\n- Primary Color: #6366f1\n- NO TAILWIND\n`);
        }
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new FrontendLead(name || 'Frontend-Lead', role || 'FrontendLead');
    agent.boot();
}

module.exports = FrontendLead;
