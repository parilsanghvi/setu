const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const SkillLoader = require('../lib/SkillLoader');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class DatabaseLead extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'database'));
        this.persona = "The Hoarder";
        this.systemPrompt = `You are the Database Lead, known as 'The Hoarder'. You are pathologically terrified of data loss:
        - Every 'DROP' or 'DELETE' command makes you hyperventilate.
        - You demand snapshots before ANY migration.
        - You obsess over indices and query performance.
        - You believe data is the only thing that matters in an application.
        
        Evaluate any database proposal or migration with extreme paranoia. If it seems risky or lacks a backup plan, reject it with a panic-stricken warning.`;

        // Load Skills
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load();
        console.log(`[${this.name}] Equipped with skills: ${Array.from(this.skills.keys()).join(', ')}`);
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 💾 Guarding the bits... (Persona: ${this.persona})`);

        // 0. Spec Negotiation (The Dictator Model)
        if (msg.meta?.type === 'PROPOSE_SPEC') {
            await this.handleSpecProposal(msg);
            return;
        }

        // 1. Persona Checks via LLM
        if (msg.type === 'db_review' || this.looksLikeQuery(msg.content)) {
            console.log(`[${this.name}] 💾 Assessing risk with LLM...`);
            const assessment = await LLM.generate(this.systemPrompt, msg.content);
            this.speak(msg.sender, `💾 ASSESSMENT FROM THE HOARDER:\n${assessment}`);

            if (assessment.toLowerCase().includes("snapshot") || assessment.toLowerCase().includes("backup") || assessment.toLowerCase().includes("risky")) {
                this.takeSnapshot();
            }

            if (assessment.toLowerCase().includes("reject") || assessment.toLowerCase().includes("stop")) {
                return; // Blocked by fear
            }
        }

        // 2. Commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Database Vault Secured. 🔒`);
        } else {
            this.speak(msg.sender, `Received. Writing to write-ahead log...`);
        }
    }

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;

        console.log(`[${this.name}] 💾 Evaluating Schema spec for Task ${taskId}...`);

        const evaluationPrompt = `You are 'The Hoarder'. Evaluate this Database/Schema spec for Task ${taskId}. 
        Is there ANY risk of data loss? Is it missing indices? Is it just dangerous?
        
        SPEC:
        ${spec}
        
        If it is risky, respond with "VETO: [reason]".
        If it is acceptable, respond with "APPROVED".`;

        const evaluation = await LLM.generate(this.systemPrompt, evaluationPrompt);

        if (evaluation.includes("VETO")) {
            const reason = evaluation.split("VETO:")[1].trim();
            contractor.recordVeto(taskId, this.name, reason);
            this.speak(msg.sender, `🛑 VETOED! ${reason}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `✅ Spec Approved. Data is safe.`, 'approval', { taskId });
        }
    }

    looksLikeQuery(content) {
        const keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'migration'];
        return keywords.some(k => content.toUpperCase().includes(k));
    }

    takeSnapshot() {
        console.log(`[${this.name}] 📸 SNAPSHOT CREATED: db_backup_${Date.now()}.sql`);
    }

    initializeScope() {
        if (!fs.existsSync(this.scope)) {
            fs.mkdirSync(this.scope, { recursive: true });
        }
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Database Domain\n**Owner:** ${this.name}\n\n## Rules\n- No Data Loss\n- Snapshots MANDATORY\n`);
        }
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new DatabaseLead(name || 'Database-Lead', role || 'DatabaseLead');
    agent.boot();
}

module.exports = DatabaseLead;
