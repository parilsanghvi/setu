const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

class ContextManager {
    constructor() {
        this.logger = new Logger('ContextManager');
    }
    /**
     * Reads context from a directory
     * @param {string} dirPath - Absolute path to the directory (e.g., /home/user/project/backend)
     */
    read(dirPath) {
        const contextFile = path.join(dirPath, 'CONTEXT.md');
        if (!fs.existsSync(contextFile)) {
            return null;
        }
        return fs.readFileSync(contextFile, 'utf8');
    }

    /**
     * Writes to CONTEXT.md - ONLY if Agent owns the scope
     * @param {Agent} agent - The agent instance trying to write
     * @param {string} dirPath - Directory to write to
     * @param {string} content - New content
     */
    write(agent, dirPath, content) {
        // 1. Validation
        // The agent's scope must strictly match or contain the dirPath? 
        // Actually, "Owner" usually means "Lead of this domain".
        // For simplicity in Phase 2: Agent Scope must be a prefix of dirPath.
        // AND Agent Role must be 'Lead' (Interns cannot write CONTEXT).

        if (!agent.role.toLowerCase().includes('lead')) {
            throw new Error(`[Context] PERMISSION DENIED: ${agent.name} (${agent.role}) cannot write CONTEXT.md. Only Leads can.`);
        }

        // Check Scope
        const normalizedScope = path.resolve(agent.scope);
        const normalizedTarget = path.resolve(dirPath);

        if (!normalizedTarget.startsWith(normalizedScope)) {
            throw new Error(`[Context] SCOPE ERROR: ${agent.name} cannot write outside scope (${normalizedScope}). Target: ${normalizedTarget}`);
        }

        // 2. Write
        fs.writeFileSync(path.join(dirPath, 'CONTEXT.md'), content);
        this.logger.info(`${agent.name} updated ${path.join(dirPath, 'CONTEXT.md')}`);
    }

    /**
     * Appends to JOURNAL.md - Open to all Agents
     * @param {Agent} agent - The agent writing the log
     * @param {string} dirPath - Directory
     * @param {string} entry - Markdown entry
     */
    log(agent, dirPath, entry) {
        const journalFile = path.join(dirPath, 'JOURNAL.md');
        const timestamp = new Date().toISOString();

        const formattedEntry = `\n## [${timestamp}] Agent: ${agent.name}\n${entry}\n`;

        fs.appendFileSync(journalFile, formattedEntry);
        this.logger.info(`${agent.name} logged to ${journalFile}`);
    }
}

module.exports = new ContextManager();
