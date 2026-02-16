const CoreAgent = require('../lib/CoreAgent');
const context = require('../lib/Context');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Shilpi extends CoreAgent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'frontend')); // Scope: /frontend
        this.persona = "Shilpi (UI/UX)";
        this.systemPrompt = `You are **Shilpi**, the Frontend Lead. You demand pixel-perfect, high-performance UI.
        - Reject ugly UI or bad UX immediately. No fluff.
        - Use modern React patterns.
        - NO TAILWIND.`;

        this.skillLoader = SkillLoader;
        this.skills = this.skillLoader.load(['frontend', 'general']);
        console.log(`Equipped with ${this.skills.size} specialized skills.`);

        // Define Tools
        this.setTools([
            {
                name: "read_file",
                description: "Read file content.",
                parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] }
            },
            {
                name: "write_file",
                description: "Write content to file.",
                parameters: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] }
            }
        ]);
    }

    async processMessage(msg) {
        console.log(`[SHILPI] Evaluating ${msg.type}...`);

        const bus = require('../lib/db');
        bus.heartbeat(this.name, this.role, this.pid, 'BUSY');

        if (msg.meta?.type === 'PROPOSE_SPEC') {
            await this.handleSpecProposal(msg);
            return;
        }

        if (msg.type === 'ui_review' || this.looksLikeUI(msg.content)) {
            console.log(`🎨 Critiquing aesthetics with LLM...`);
            const critique = await LLM.generate(this.systemPrompt, msg.content);
            this.speak(msg.sender, `🎨 CRITIQUE FROM THE ARTIST:\n${critique}`);
            return;
        }

        // Default to CoreAgent loop for other interactions
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Frontend Studio Initialized. 🖌️`);
            return;
        }

        await super.processMessage(msg);
    }

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;
        console.log(`🖌️ Evaluating UI spec for Task ${taskId}...`);

        const evaluation = await LLM.generate(this.systemPrompt, `Evaluate spec: ${spec}`);

        if (evaluation.includes("VETO")) {
            const reason = evaluation.split("VETO:")[1].trim();
            contractor.recordVeto(taskId, this.name, reason);
            this.speak(msg.sender, `🛑 VETOED! ${reason}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `✅ Spec Approved.`, 'approval', { taskId });
        }
    }

    looksLikeUI(content) {
        return content.includes('<div') || content.includes('css') || content.includes('style') || content.includes('className');
    }

    initializeScope() {
        if (!fs.existsSync(this.scope)) fs.mkdirSync(this.scope, { recursive: true });
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Frontend Domain\n**Owner:** ${this.name}\n`);
        }
    }
}

if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Shilpi(name || 'Shilpi', role || 'Shilpi');
    agent.boot();
}

module.exports = Shilpi;
