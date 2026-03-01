const CoreAgent = require('../lib/CoreAgent');
const fs = require('fs');
const path = require('path');
const LLM = require('../lib/LLM');

class Shishya extends CoreAgent {
    constructor(name, role, scope, leadRole) {
        super(name, role, scope);
        this.leadRole = leadRole; // e.g., 'BackendLead'
        this.status = 'IDLE'; // IDLE, PLANNING, WAITING_FOR_APPROVAL, EXECUTING

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

    /**
     * Entry point for a task. 
     * Junior agents MUST propose a plan first.
     */
    async executeTask(taskId, objective) {
        console.log(`[${this.name}] 🐣 New Task: ${objective}. Starting proposal phase...`);
        this.status = 'PLANNING';

        const plan = await this.generatePlan(objective);
        this.writePlan(plan);

        this.speak(this.leadRole, `PROPOSAL: ${objective}. I have drafted a PLAN.md in ${this.scope}. Please review.`, 'proposal', {
            taskId,
            planPath: path.join(this.scope, 'PLAN.md')
        });

        this.status = 'WAITING_FOR_APPROVAL';
    }

    async generatePlan(objective) {
        const prompt = `You are a **Shishya** (Student Agent). Generate a step-by-step PLAN.md for the following objective:
        "${objective}"
        
        Focus on technical details. If you plan to modify or delete files, state clearly which ones and why.
        Format: Markdown.`;

        return await LLM.generate("System: You are a productive junior engineer/student.", prompt);
    }

    writePlan(content) {
        if (!fs.existsSync(this.scope)) {
            fs.mkdirSync(this.scope, { recursive: true });
        }
        const planPath = path.join(this.scope, 'PLAN.md');
        fs.writeFileSync(planPath, content);
        console.log(`[${this.name}] 📝 PLAN.md written to ${planPath}`);
    }

    async processMessage(msg) {
        // Handle Approval
        if (msg.type === 'approval' && this.status === 'WAITING_FOR_APPROVAL') {
            console.log(`[${this.name}] ✅ Plan approved! Moving to EXECUTION.`);
            this.status = 'EXECUTING';
            this.onApproval(msg);
            return;
        }

        // Handle Rejection
        if (msg.type === 'rejection' && this.status === 'WAITING_FOR_APPROVAL') {
            const critique = msg.content;
            console.warn(`[${this.name}] ❌ Plan rejected. Reason: ${critique}`);
            this.status = 'PLANNING';
            await this.revisePlan(critique);
            return;
        }

        // Default: CoreLoop
        await super.processMessage(msg);
    }

    async revisePlan(critique) {
        console.log(`[${this.name}] 🔄 Revising plan based on Lead feedback...`);
        // Logic to update PLAN.md and re-propose
        // For MVP, just logs. In real app, would call LLM again with critique.
    }

    onApproval(msg) {
        // Implementation provided by specific intern roles
    }
}

if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Shishya(name || 'Shishya', role || 'Shishya');
    agent.boot();
}

module.exports = Shishya;
