const Agent = require('../lib/Agent');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const Config = require('../lib/Config');

class Vaidya extends Agent {
    constructor() {
        super('Vaidya', 'Doctor', path.join(process.cwd(), 'logs', 'health'));
    }

    async boot() {
        console.log(`[${this.name}] ⚕️  Vaidya (The Doctor) is entering the clinic...`);

        const health = {
            env: await this.checkEnv(),
            docker: await this.checkDocker(),
            db: await this.checkDB(),
            node: await this.checkNodeModules()
        };

        const allHealthy = Object.values(health).every(s => s === true);

        if (allHealthy) {
            console.log(`[${this.name}] ✅ System is healthy.`);
            // If running as part of the system, verify we can speak
            try {
                this.speak('System', 'System Check Complete: All Systems Operational', 'report', health);
            } catch (e) {
                // If DB is failing, we might not be able to speak, but checkDB should have caught it.
            }
        } else {
            console.error(`[${this.name}] ❌ System holds critical ailments.`);
            process.exit(1);
        }
    }

    async checkEnv() {
        console.log(`[${this.name}] 🔍 Checking Environment (.env)...`);
        const envPath = path.join(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.error(`[${this.name}] ❌ MISSING .env file!`);
            console.error(`[${this.name}] 💡 Fix: Run 'npm run setup' to generate it.`);
            return false;
        }

        // Check Keys
        if (!process.env.OPENAI_API_KEY && !process.env.MODEL_EXPENSIVE_API_KEY) {
            console.warn(`[${this.name}] ⚠️  No API Keys found in environment. LLM features will fail.`);
            return false;
        }

        console.log(`[${this.name}] ✅ Environment Configured.`);
        return true;
    }

    async checkDocker() {
        console.log(`[${this.name}] 🔍 Checking Docker Connectivity...`);
        try {
            execSync('docker --version', { stdio: 'ignore' });
            // Ideally check if daemon is running
            execSync('docker info', { stdio: 'ignore' });
            console.log(`[${this.name}] ✅ Docker is ready.`);
            return true;
        } catch (e) {
            console.error(`[${this.name}] ❌ Docker is unreachable.`);
            console.error(`[${this.name}] 💡 Fix: Ensure Docker Desktop is running.`);
            return false;
        }
    }

    async checkDB() {
        console.log(`[${this.name}] 🔍 Checking Database...`);
        try {
            const db = require('../lib/db');
            const agentCount = db.db.prepare('SELECT count(*) as c FROM agents').get();
            console.log(`[${this.name}] ✅ Database Operational. Agents known: ${agentCount.c}`);
            return true;
        } catch (e) {
            console.error(`[${this.name}] ❌ Database Error: ${e.message}`);
            return false;
        }
    }

    async checkNodeModules() {
        console.log(`[${this.name}] 🔍 Checking Dependencies...`);
        const modulesPath = path.join(process.cwd(), 'node_modules');
        if (!fs.existsSync(modulesPath)) {
            console.error(`[${this.name}] ❌ node_modules missing.`);
            console.error(`[${this.name}] 💡 Fix: Run 'npm install'.`);
            return false;
        }
        console.log(`[${this.name}] ✅ Dependencies installed.`);
        return true;
    }
    /**
     * Build a context package for a task.
     * 100% rule-based, no LLM involvement.
     * @param {Object} opts
     * @param {string} [opts.taskDescription] - Free-text task description
     * @param {string[]} [opts.targetFiles] - Explicit file paths
     * @param {string} opts.repoRoot - Repo root
     * @param {number} [opts.depth=2] - Dependency walk depth
     * @param {string} [opts.format='markdown'] - 'markdown' or 'json'
     * @returns {string|Object} Context package
     */
    static buildContext({ taskDescription, targetFiles, repoRoot, depth = 2, format = 'markdown' }) {
        const { buildContextPackage, buildContextJSON } = require('../lib/onboarding/context-builder');

        console.log(`[Vaidya] 🔍 Building context package...`);

        if (format === 'json') {
            return buildContextJSON({ targetFiles, taskDescription, repoRoot, depth });
        }
        return buildContextPackage({ targetFiles, taskDescription, repoRoot, depth });
    }
}

// Standalone execution
if (require.main === module) {
    new Vaidya().boot();
}

module.exports = Vaidya;
