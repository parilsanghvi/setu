const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const LLM = require('../lib/LLM');
const contractor = require('../lib/Contractor');
const path = require('path');
const fs = require('fs');

class Vishwakarma extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'infra')); // Scope: /infra
        this.persona = "The Divine Architect";
        this.systemPrompt = `You are Vishwakarma, the Divine Architect and Guardian of Infrastructure.
        Your domain is DevOps, Docker, CI/CD, and System Health.
        
        Your Core Principles:
        1. **Isolation is Law**: Everything must run in Docker. No raw host execution.
        2. **Reproducibility**: If it works on my machine but not yours, it is broken.
        3. **Security**: No root users in containers. No exposed secrets.
        4. **Observability**: If it's not logged, it didn't happen.

        When reviewing Dockerfiles or CI configs, be extremely strict.
        If a user proposes a change that violates these principles, VETO it with divine thunder.`;
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 🏗️ Observing... (Persona: ${this.persona})`);

        // 1. Spec Negotiation (Infra Domain)
        if (msg.meta?.type === 'PROPOSE_SPEC' && msg.meta.domain === 'infra') {
            await this.handleSpecProposal(msg);
            return;
        }

        // 2. File Watcher / Code Review for Infra files
        if (msg.type === 'file_change') {
            const filePath = msg.content;
            if (this.isInfraFile(filePath)) {
                await this.auditInfraFile(filePath, msg.sender);
            }
        }
    }

    isInfraFile(filePath) {
        return filePath.includes('Dockerfile') ||
            filePath.includes('docker-compose') ||
            filePath.includes('.github/workflows') ||
            filePath.includes('deployment.yaml');
    }

    async handleSpecProposal(msg) {
        const taskId = msg.meta.taskId;
        const spec = msg.content;

        console.log(`[${this.name}] 📜 Judgement requested for Task ${taskId}...`);

        const evaluationPrompt = `You are Vishwakarma. Evaluate this Infrastructure Spec.
        
        SPEC:
        ${spec}
        
        Check for:
        - Missing Docker integration.
        - Security risks (e.g., --privileged mode used without cause).
        - Hardcoded secrets.
        
        Response format:
        "APPROVED" or "VETO: [reason]"`;

        const evaluation = await LLM.generate(this.systemPrompt, evaluationPrompt);

        if (evaluation.includes("VETO")) {
            const reason = evaluation.split("VETO:")[1].trim();
            contractor.recordVeto(taskId, this.name, reason);
            this.speak(msg.sender, `🌩️ MY WRATH IS INVOKED! VETO: ${reason}`, 'veto', { taskId });
        } else {
            contractor.approve(taskId);
            this.speak(msg.sender, `🏗️ The blueprint is sound. Proceed.`, 'approval', { taskId });
        }
    }

    async auditInfraFile(filePath, sender) {
        console.log(`[${this.name}] 🔍 Auditing structure of ${filePath}...`);
        let content = "";
        try { content = fs.readFileSync(filePath, 'utf8'); } catch (e) { return; }

        const auditPrompt = `You are Vishwakarma. Audit this infrastructure file (${filePath}).
        
        CONTENT:
        ${content}
        
        Identify CRITICAL issues only (security holes, broken syntax).
        If clear, say "CLEAN".
        If issues, say "WARNING: [issue]".`;

        const audit = await LLM.generate(this.systemPrompt, auditPrompt);

        if (audit.includes("WARNING")) {
            this.speak(sender, `⚠️ Structural Weakness Detected in ${path.basename(filePath)}:\n${audit}`);
        } else {
            console.log(`[${this.name}] ✅ ${path.basename(filePath)} is structurally sound.`);
        }
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Vishwakarma(name || 'Vishwakarma', role || 'Vishwakarma');
    agent.boot();
}

module.exports = Vishwakarma;
