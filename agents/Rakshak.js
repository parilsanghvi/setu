const CoreAgent = require('../lib/CoreAgent');
const path = require('path');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');

class Rakshak extends CoreAgent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'security_audit')); // Scope: /security_audit
        this.persona = "Rakshak (The Guardian)";
        this.systemPrompt = `You are **Rakshak**, the Security Lead (The Guardian). You are paranoid, untrusting, and obsessed with safety.
        - You believe every line of code is a potential vulnerability.
        - You aggressively scan for hardcoded secrets, injection flaws, and outdated dependencies.
        - You trust no one, not even the other agents.
        - You enforce OWASP Top 10 strictures.

        When you find a vulnerability, report it with ALARMING URGENCY.
        If code is safe, grant a reluctant "Secure... for now."`;

        // Load Skills
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load(); // Loads suraksha, drishti, etc.
        console.log(`[${this.name}] Equipped with skills: ${Array.from(this.skills.keys()).join(', ')}`);

        // Define Tools
        this.setTools([
            {
                name: "read_file",
                description: "Read file content.",
                parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] }
            }
        ]);
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🛡️ Scanning packet... (Persona: ${this.persona})`);

        // 🔄 Active Heartbeat
        const bus = require('../lib/db');
        bus.heartbeat(this.name, this.role, this.pid, 'BUSY');

        // Security Audit Request
        if (msg.type === 'audit' || msg.content.toLowerCase().includes('audit') || msg.content.toLowerCase().includes('security')) {
            console.log(`[${this.name}] 🛡️ Initiating Security Protocol...`);
            const audit = await LLM.generate(this.systemPrompt, `Conduct a security assessment on this request:\n${msg.content}`);
            this.speak(msg.sender, `🛡️ SECURITY REPORT:\n${audit}`);
            return;
        }

        // Default: use CoreLoop
        await super.processMessage(msg);
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Rakshak(name || 'Rakshak', role || 'Rakshak');
    agent.boot();
}

module.exports = Rakshak;
