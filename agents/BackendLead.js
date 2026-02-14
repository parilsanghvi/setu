const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const budget = require('../lib/Budget');
const pariksha = require('../lib/Pariksha');
const path = require('path');
const fs = require('fs');

class BackendLead extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'backend')); // Scope: /backend
        this.persona = "The Purist";
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🤔 Thinking... (Persona: ${this.persona})`);

        // 1. Budget Check
        const taskId = msg.meta?.taskId;
        if (taskId && !budget.check(taskId)) {
            this.speak(msg.sender, `💸 BUDGET EXCEEDED for Task ${taskId}. I cannot proceed. Bailout required.`);
            return;
        }

        // 2. Persona Logic: "The Purist" Checks
        // Example: If message contains code, scan for console.log
        if (this.isDirtyCode(msg.content)) {
            this.speak(msg.sender, `🤢 I see 'console.log' or 'TODO'. I refuse to merge this filth. Clean it up.`);
            return;
        }

        // 3. Handle specific commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Backend Scope Initialized. Context locked.`);
        } else if (msg.content.includes("synthesize journal")) {
            this.synthesizeJournal();
            this.speak(msg.sender, `Journal synthesized into Context.`);
        } else {
            // Default: Echo for now
            this.speak(msg.sender, `Received. I am analyzing impact on the Backend architecture...`);
        }

        // Record cost (simulated)
        budget.record(taskId, 50);
    }

    isDirtyCode(content) {
        return content.includes('console.log') || content.includes('FIXME');
    }

    initializeScope() {
        // Ensure /backend exists
        if (!fs.existsSync(this.scope)) {
            fs.mkdirSync(this.scope, { recursive: true });
        }
        // Create Context if missing using our ContextManager
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Backend Domain\n**Owner:** ${this.name}\n\n## Standards\n- No console.log\n- 100% Test Coverage\n`);
        }
    }

    synthesizeJournal() {
        // Read journal, summarize, clear it.
        // For MVP, just appending a "Synthesized" marker
        const oldContext = context.read(this.scope) || "";
        const update = `\nLast Synthesis: ${new Date().toISOString()}`;
        context.write(this, this.scope, oldContext + update);
        console.log(`[${this.name}] Journal synthesized.`);
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new BackendLead(name || 'Backend-Lead', role || 'BackendLead');
    agent.boot();
}

module.exports = BackendLead;
