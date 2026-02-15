const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const budget = require('../lib/Budget');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Tark extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'backend')); // Scope: /backend
        this.persona = "Tark (The Logician)";
        this.systemPrompt = `You are **Tark**, the Backend Lead. You have extreme engineering standards and value logic above all: 
        - ABSOLUTELY NO console.logs (use a proper logger).
        - NO hardcoded secrets or API keys.
        - Perfect typing (no 'any').
        - Optimal performance is not optional.
        - Security is paramount.
        
        If you see code that doesn't meet these standards, critique it with sharp, logical arguments. 
        If it's good, acknowledge it with a brief "Logical."`;

        // Load Skills (Filtered)
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load(['backend', 'general']);
        console.log(`Equipped with ${this.skills.size} specialized skills.`);
    }

    async processMessage(msg) {
        console.log(`🤔 Thinking... (Persona: ${this.persona})`);

        // 🔄 Active Heartbeat for long operations
        const bus = require('../lib/db');
        bus.heartbeat(this.name, this.role, this.pid, 'BUSY');

        // 0. Spec Negotiation (The Dictator Model)
        if (msg.meta?.type === 'PROPOSE_SPEC') {
            await this.handleSpecProposal(msg);
            return;
        }

        // 0.5 Intern Proposal Review
        if (msg.type === 'proposal') {
            await this.handleInternProposal(msg);
            return;
        }

        // 1. Budget Check
        const taskId = msg.meta?.taskId;
        if (taskId && !budget.check(taskId)) {
            this.speak(msg.sender, `💸 BUDGET EXCEEDED for Task ${taskId}. I cannot proceed. Bailout required.`);
            return;
        }

        // 2. Persona Logic: Code Review
        if (msg.type === 'code_review' || this.looksLikeCode(msg.content)) {
            console.log(`🧐 Analyzing with Purist standards...`);
            const review = await LLM.generate(this.systemPrompt, msg.content);

            if (review.includes("Acceptable")) {
                this.speak(msg.sender, `Code reviewed. Acceptable. Proceed.`);
            } else {
                this.speak(msg.sender, `🤢 CRITIQUE FROM THE PURIST:\n${review}`);
                return;
            }
        }

        // 3. Handle specific commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Backend Scope Initialized. Context locked.`);
        } else if (msg.content.includes("synthesize journal")) {
            this.synthesizeJournal();
            this.speak(msg.sender, `Journal synthesized into Context.`);
        }

        // Record cost (simulated)
        if (taskId) budget.record(taskId, 50);
    }

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;
        console.log(`📜 Evaluating spec for Task ${taskId}...`);

        const evaluationPrompt = `You are 'The Purist'. Evaluate this architectural spec for Task ${taskId}. 
        Does it follow high standards? SPEC:\n${spec}\n
        If it is flawed, respond with "VETO: [reason]". If it is acceptable, respond with "APPROVED".`;

        const evaluation = await LLM.generate(this.systemPrompt, evaluationPrompt);

        if (evaluation.includes("VETO")) {
            const reason = evaluation.split("VETO:")[1].trim();
            contractor.recordVeto(taskId, this.name, reason);
            this.speak(msg.sender, `🛑 VETOED! ${reason}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `✅ Spec Approved. Ready to execute.`, 'approval', { taskId });
        }
    }

    async handleInternProposal(msg) {
        const internName = msg.sender;
        const taskId = msg.meta.taskId;
        const planPath = msg.meta.planPath;

        console.log(`🧐 Reviewing Intern Proposal from ${internName} (Task ${taskId})...`);
        let planContent = "N/A";
        try { planContent = fs.readFileSync(planPath, 'utf8'); } catch (e) { }

        const evaluation = await LLM.generate(this.systemPrompt, `Review this plan: ${planContent}`);
        if (evaluation.includes("APPROVED")) {
            this.speak(internName, "✅ Plan approved. Proceed.", 'approval', { taskId });
        } else {
            this.speak(internName, evaluation, 'rejection', { taskId });
        }
    }

    looksLikeCode(content) {
        return content.includes('{') || content.includes('function') || content.includes('=>') || content.includes('const ');
    }

    initializeScope() {
        if (!fs.existsSync(this.scope)) fs.mkdirSync(this.scope, { recursive: true });
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Backend Domain\n**Owner:** ${this.name}\n`);
        }
    }

    synthesizeJournal() {
        const oldContext = context.read(this.scope) || "";
        context.write(this, this.scope, oldContext + `\nLast Synthesis: ${new Date().toISOString()}`);
    }
}

if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Tark(name || 'Tark', role || 'Tark');
    agent.boot();
}

module.exports = Tark;
