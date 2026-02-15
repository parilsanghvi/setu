const Agent = require('../lib/Agent');
const path = require('path');
const fs = require('fs');
const LLM = require('../lib/LLM');

class Guru extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'skills', 'learned'));
        this.persona = "The Guru";
        // System Prompt for Drona
        // Load Skills (Filtered)
        const SkillLoader = require('../lib/SkillLoader');
        this.skillLoader = new SkillLoader();
        this.skills = this.skillLoader.load(['general']);
        console.log(`[${this.name}] Equipped with ${this.skills.size} specialized skills.`);
    }

    async processMessage(msg) {
        // 🔄 Active Heartbeat for long operations
        const bus = require('../lib/db');
        bus.heartbeat(this.name, this.role, this.pid, 'BUSY');
        // Drona listens for "TASK_DONE" events
        if (msg.meta && msg.meta.type === 'TASK_DONE') {
            const taskId = msg.meta.taskId;
            console.log(`[${this.name}] 🧘 Meditating on completed Task ${taskId}...`);
            await this.extractPattern(taskId, msg.meta);
        }

        // Death Learning: Analyze agent crashes
        if (msg.type === 'event' && msg.meta?.type === 'AGENT_CRASH') {
            const agentName = msg.meta.agentName;
            console.log(`[${this.name}] 💀 Death Learning: Analyzing crash of ${agentName}...`);
            await this.analyzeCrash(agentName, msg.meta);
        }

        // Drona: Knowledge Ingestion
        if (msg.type === 'ingest_docs') {
            const { content, language } = msg.meta;
            console.log(`[${this.name}] 📚 Devouring knowledge for ${language}...`);
            await this.learnLanguage(content, language);
        }

        // Drona: Dependency Drift
        if (msg.type === 'track_drift') {
            const { packageName, currentVersion } = msg.meta;
            console.log(`[${this.name}] 🕵️ Checking drift for ${packageName} (v${currentVersion})...`);
            await this.trackDrift(packageName, currentVersion);
        }
    }

    // Drona: Track Drift & Create Migration Skill
    async trackDrift(packageName, currentVersion) {
        // In a real scenario, we'd fetch actual changelogs or use 'npm view'
        // Here we simulate the research phase
        const researchPrompt = `You are Drona. The user is using ${packageName} v${currentVersion}.
        Assume the latest version is significantly newer (e.g., v${parseInt(currentVersion) + 1} or higher).
        
        Generate a "Migration Skill" that covers breaking changes and upgrade steps.
        
        OUTPUT FORMAT (JSON):
        {
            "slug": "migrate-${packageName}-v${currentVersion}-to-latest",
            "description": "Migration guide for ${packageName} from v${currentVersion}.",
            "content": "# Migration Guide: ${packageName}\\n\\n## Breaking Changes\\n[...]\\n\\n## Automated Fixes\\n[...]"
        }`;

        try {
            const response = await LLM.generate(this.systemPrompt, researchPrompt);
            const skillData = this.parseResponse(response);
            if (skillData) {
                this.saveSkill(skillData);
                console.log(`[${this.name}] 🔄 Migration skill created: ${skillData.slug}`);
            }
        } catch (e) {
            console.error(`[${this.name}] ❌ Failed to track drift for ${packageName}:`, e.message);
        }
    }

    // Drona: Learn a new language or framework from docs
    async learnLanguage(docContent, language) {
        try {
            const prompt = `You are Drona. Convert this raw documentation into a structured "Syntax Skill" for ${language}.
            
            DOCUMENTATION:
            ${docContent.substring(0, 5000)}... (truncated)

            OUTPUT FORMAT (JSON):
            {
                "slug": "${language.toLowerCase()}-syntax",
                "description": "Essential syntax and patterns for ${language}.",
                "content": "# ${language} Guide\n\n## Basic Syntax\n[...]\n\n## Common Patterns\n[...]"
            }`;

            const response = await LLM.generate(this.systemPrompt, prompt);
            const skillData = this.parseResponse(response);
            if (skillData) {
                this.saveSkill(skillData);
                console.log(`[${this.name}] 🧠 I now understand ${language}.`);
            }
        } catch (e) {
            console.error(`[${this.name}] ❌ Failed to learn ${language}:`, e.message);
        }
    }

    async analyzeCrash(agentName, meta) {
        const crashJournal = `Agent: ${agentName}\nReason: ${meta.reason || 'Unknown'}\nLast Journal Entry: ${meta.lastJournal || 'N/A'}`;

        try {
            const crashSystemPrompt = `You are Drona, the Guru. An agent has crashed. 
            Identify the "Lethal Pattern" (e.g., Infinite loop, regex bomb, stack overflow) that killed it.
            Abstract this into a Warning Skill so others don't repeat the mistake.
            
            OUTPUT FORMAT (JSON):
            {
                "slug": "lethal-pattern-name",
                "description": "AVOID THIS: [description].",
                "content": "# WARNING: Lethal Pattern\n\n## Description\n[details]\n\n## Prevention\n[steps]"
            }`;

            const response = await LLM.generate(crashSystemPrompt, `Analyze this crash:\n${crashJournal}`);
            const skillData = this.parseResponse(response);
            if (skillData) {
                this.saveSkill(skillData);
                console.log(`[${this.name}] 🛡️ Lethal pattern crystallized to prevent future deaths.`);
            }
        } catch (e) {
            console.error(`[${this.name}] ❌ Failed to learn from death:`, e.message);
        }
    }

    async extractPattern(taskId, meta) {
        let context = `Task ID: ${taskId}\nMeta: ${JSON.stringify(meta)}`;
        let attempt = 1;
        const maxAttempts = 2;

        while (attempt <= maxAttempts) {
            try {
                console.log(`[${this.name}] 🧘 Attempt ${attempt}: Meditating on task ${taskId}...`);
                const response = await LLM.generate(this.systemPrompt, `Analyze this task and generate a skill:\n${context}`);

                const skillData = this.parseResponse(response);
                if (skillData) {
                    this.saveSkill(skillData);
                    return;
                }
            } catch (e) {
                console.warn(`[${this.name}] ⚠️ Attempt ${attempt} failed:`, e.message);
                if (attempt === 1) {
                    console.log(`[${this.name}] 📉 Retrying with smaller context...`);
                    // Simplify context for second attempt
                    context = `Task ID: ${taskId}\nSummary: Task was completed. Extract core pattern.`;
                }
            }
            attempt++;
        }

        console.error(`[${this.name}] ❌ Failed to crystallize knowledge after ${maxAttempts} attempts.`);
        this.speak(meta.sender || 'System', `I tried to learn from ${taskId}, but my mind was too clouded.`);
    }

    parseResponse(response) {
        // 1. Try raw JSON
        try {
            return JSON.parse(response.trim());
        } catch (e) { }

        // 2. Try Markdown block regex
        const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = response.match(jsonBlockRegex);
        if (match) {
            try {
                return JSON.parse(match[1].trim());
            } catch (e) { }
        }

        // 3. Fallback: search for first { and last }
        const firstBrace = response.indexOf('{');
        const lastBrace = response.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            try {
                const potentialJson = response.substring(firstBrace, lastBrace + 1);
                return JSON.parse(potentialJson.trim());
            } catch (e) { }
        }

        return null;
    }

    saveSkill(data) {
        const skillDir = path.join(this.scope, data.slug);
        const skillFile = path.join(skillDir, 'SKILL.md');

        if (!fs.existsSync(skillDir)) {
            fs.mkdirSync(skillDir, { recursive: true });
        }

        const frontmatter = `---
name: ${data.slug}
description: ${data.description.replace(/:/g, '-')} 
version: 1.0.0
author: Drona
---

`;

        fs.writeFileSync(skillFile, frontmatter + data.content);
        console.log(`[${this.name}] 📜 Knowledge crystallized: ${skillFile}`);

        // Notify System
        // We use 'process' global or similar in real app, here just log.
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new Guru(name || 'Guru', role || 'Guru');
    agent.boot();
}

module.exports = Guru;
