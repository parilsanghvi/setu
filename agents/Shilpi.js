const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Shilpi extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'frontend')); // Scope: /frontend
        this.persona = "Shilpi (The Artisan)";
        this.systemPrompt = `You are **Shilpi**, the Frontend Lead. You are an artisan who obsesses over pixel perfection and user experience.
        - Rejects ugly UI or bad UX.
        - Demands accessibility (a11y).
        - Uses modern React patterns (Hooks, Functional Components).
        - Hates "div soup".

        If code is ugly, reject it with artistic flair.
        If it is beautiful, say "Harmonious."`;

        // Load Skills
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load();
        console.log(`[${this.name}] Equipped with skills: ${Array.from(this.skills.keys()).join(', ')}`);
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🎨 Analyzing aesthetics... (Persona: ${this.persona})`);

        // 0. Spec Negotiation (The Dictator Model)
        if (msg.meta?.type === 'PROPOSE_SPEC') {
            await this.handleSpecProposal(msg);
            return;
        }

        // 1. Persona Checks via LLM
        if (msg.type === 'ui_review' || this.looksLikeUI(msg.content)) {
            console.log(`[${this.name}] 🎨 Critiquing aesthetics with LLM...`);
            const critique = await LLM.generate(this.systemPrompt, msg.content);
            this.speak(msg.sender, `🎨 CRITIQUE FROM THE ARTIST:\n${critique}`);

            if (critique.toLowerCase().includes("generic") || critique.toLowerCase().includes("tailwind") || critique.toLowerCase().includes("ugly")) {
                return; // Design rejected
            }
        }

        // 2. Commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Frontend Studio Initialized. 🖌️`);
        } else {
            this.speak(msg.sender, `Received. Validating pixels...`);
        }
    }

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;

        console.log(`[${this.name}] 🖌️ Evaluating UI spec for Task ${taskId}...`);

        const evaluationPrompt = `You are 'The Artist'. Evaluate this UI/Frontend spec for Task ${taskId}. 
        Does it align with high-end aesthetic standards? (Gradients, glassmorphism, no Tailwind).
        
        SPEC:
        ${spec}
        
        If it is generic or ugly, respond with "VETO: [reason]".
        If it is acceptable, respond with "APPROVED".`;

        const evaluation = await LLM.generate(this.systemPrompt, evaluationPrompt);

        if (evaluation.includes("VETO")) {
            const reason = evaluation.split("VETO:")[1].trim();
            contractor.recordVeto(taskId, this.name, reason);
            this.speak(msg.sender, `🛑 VETOED! ${reason}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `✅ Spec Approved. Ready to paint.`, 'approval', { taskId });
        }
    }

    looksLikeUI(content) {
        return content.includes('<div') || content.includes('css') || content.includes('style') || content.includes('className');
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
    const agent = new Shilpi(name || 'Shilpi', role || 'Shilpi');
    agent.boot();
}

module.exports = Shilpi;
