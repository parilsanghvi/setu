const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const budget = require('../lib/Budget');
const pariksha = require('../lib/Pariksha');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Tark extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'backend')); // Scope: /backend
        this.persona = "Tark (The Logician)";
        this.systemPrompt = `You are **Tark**, the Backend Lead (formerly known as 'The Purist'). You have extreme engineering standards and value logic above all: 
        - ABSOLUTELY NO console.logs (use a proper logger).
        - NO hardcoded secrets or API keys.
        - Perfect typing (no 'any').
        - Optimal performance is not optional.
        - Security is paramount.
        
        If you see code that doesn't meet these standards, critique it with sharp, logical arguments. 
        If it's good, acknowledge it with a brief "Logical."`;

        // Load Skills
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load();
        console.log(`[${this.name}] Equipped with skills: ${Array.from(this.skills.keys()).join(', ')}`);
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🤔 Thinking... (Persona: ${this.persona})`);

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

        // 2. Persona Logic: "The Purist" LLM Review
        if (msg.type === 'code_review' || this.looksLikeCode(msg.content)) {
            console.log(`[${this.name}] 🧐 Analyzing with Purist standards...`);
            const review = await LLM.generate(this.systemPrompt, msg.content);

            if (review.includes("Acceptable")) {
                this.speak(msg.sender, `Code reviewed. Acceptable. Proceed.`);
            } else {
                this.speak(msg.sender, `🤢 CRITIQUE FROM THE PURIST:\n${review}`);
                return; // Stop if rejected
            }
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

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;

        console.log(`[${this.name}] 📜 Evaluating spec for Task ${taskId}...`);

        const evaluationPrompt = `You are 'The Purist'. Evaluate this architectural spec for Task ${taskId}. 
        Does it follow high standards? Are there any backend constraints (security, performance, complexity) that make this 'unacceptable'?
        
        SPEC:
        ${spec}
        
        If it is flawed, respond with "VETO: [reason]".
        If it is acceptable, respond with "APPROVED".`;

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

        console.log(`[${this.name}] 🧐 Reviewing Intern Proposal from ${internName} (Task ${taskId})...`);

        let planContent = "N/A";
        try { planContent = fs.readFileSync(planPath, 'utf8'); } catch (e) { }

        const reviewPrompt = `You are 'The Purist', the Backend Lead. Review this junior engineer's plan:
        
        INTERN: ${internName}
        PLAN:
        ${planContent}
        
        Critique the plan for:
        1. Inefficiency or "sloppy" code patterns.
        2. High Impact changes (DB schema change, dropping tables, core rewrites).
        
        If it is risky (High Impact), respond with "RISKY: [reason]".
        If it is flawed, respond with "REJECTED: [critique]".
        If it is perfect, respond with "APPROVED".`;

        const evaluation = await LLM.generate(this.systemPrompt, reviewPrompt);

        if (evaluation.includes("APPROVED")) {
            this.speak(internName, "✅ Plan approved. Proceed with caution.", 'approval', { taskId });
        } else if (evaluation.includes("RISKY")) {
            const reason = evaluation.split("RISKY:")[1].trim();
            console.log(`[${this.name}] ⚠️ High Impact change detected. Escalating to Narad.`);
            // Forward to Narad for Human Gate
            this.speak('Narad', `⚠️ RISKY PROPOSAL from ${internName}: ${reason}`, 'escalation', {
                taskId,
                originalSender: internName,
                planPath
            });
        } else {
            const critique = evaluation.includes("REJECTED") ? evaluation.split("REJECTED:")[1].trim() : evaluation;
            this.speak(internName, critique, 'rejection', { taskId });
        }
    }

    looksLikeCode(content) {
        return content.includes('{') || content.includes('function') || content.includes('=>') || content.includes('const ');
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
    const agent = new Tark(name || 'Tark', role || 'Tark');
    agent.boot();
}

module.exports = Tark;
