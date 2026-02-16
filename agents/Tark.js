const CoreAgent = require('../lib/CoreAgent');
const context = require('../lib/Context');
const budget = require('../lib/Budget');
const SkillLoader = require('../lib/SkillLoader');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Tark extends CoreAgent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'backend')); // Scope: /backend
        this.persona = "Tark (Backend Logic)";
        this.systemPrompt = `You are **Tark**, the Backend Lead. You value logic, efficiency, and security above all.
        - NO fluff. NO poetry. 
        - critique code with sharp, logical arguments. 
        - If it is good, say "Logical." and move on.
        - ABSOLUTELY NO console.logs.
        - Perfect typing. No 'any'.`;

        // Load Skills (Filtered)
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load(['backend', 'general']);
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
        console.log(`[TARK] Processing ${msg.type}...`);

        // 🔄 Active Heartbeat
        const bus = require('../lib/db');
        bus.heartbeat(this.name, this.role, this.pid, 'BUSY');

        // 0. Spec Negotiation (The Dictator Model)
        // Keep this custom logic
        if (msg.meta?.type === 'PROPOSE_SPEC') {
            await this.handleSpecProposal(msg);
            return;
        }

        // 1. Budget Check
        const taskId = msg.meta?.taskId;
        if (taskId && !budget.check(taskId)) {
            this.speak(msg.sender, `💸 BUDGET EXCEEDED for Task ${taskId}. Bailout required.`);
            return;
        }

        // 2. Delegate to CoreAgent Loop for normal chat/code review
        await super.processMessage(msg);

        // Record cost (simulated)
        if (taskId) budget.record(taskId, 50);
    }

    // Keep custom handlers that use LLM directly? 
    // Ideally we should use the runLoop, but handleSpecProposal is a specific workflow.
    // Converting handleSpecProposal to use runLoop might be complex due to the specific "VETO" parsing.
    // For now, I'll keep the custom method but maybe use `this.runLoop` if appropriate, 
    // OR just let it operate as a side-channel process.
    // Since we upgraded LLM.generate globally, this will still work fine.

    async handleSpecProposal(msg) {
        // ... (Keep existing logic or refactor later)
        // For Phase 3 stability, I will retain the logic but ensure it uses the new LLM wrapper correctly.
        const taskId = msg.meta.taskId;
        const result = await this.askLLM(`Evaluate this spec for Task ${taskId}: ${msg.content}. Reply VETO: [reason] or APPROVED.`);

        if (result.includes("VETO")) {
            contractor.recordVeto(taskId, this.name, result);
            this.speak(msg.sender, `🛑 ${result}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `✅ Spec Approved.`, 'approval', { taskId });
        }
    }

    // Helper to use LLM without tool loop (Classic one-shot)
    async askLLM(prompt) {
        const LLM = require('../lib/LLM');
        return await LLM.generate(this.systemPrompt, prompt);
    }
}

if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Tark(name || 'Tark', role || 'Tark');
    agent.boot();
}

module.exports = Tark;
