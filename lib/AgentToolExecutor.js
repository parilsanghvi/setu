const fs = require('fs');
const path = require('path');
const { z } = require('zod');

/**
 * Handles execution of tools for CoreAgent, including built-in file tools
 * and dynamically loaded skills.
 */
class AgentToolExecutor {
    constructor(agent) {
        this.agent = agent; // Reference back to the CoreAgent instance
    }

    /**
     * Execute a specific tool.
     */
    async executeTool(toolCall) {
        const { name, args } = toolCall;
        this.agent.logger.info(`🛠️ Executing Tool: ${name}`, args);

        // 1. Schema Validation (if defined)
        const toolDef = this.agent.tools.find(t => t.name === name);
        if (toolDef && toolDef.parameters) {
            if (toolDef.schema && toolDef.schema instanceof z.ZodType) {
                try {
                    toolDef.schema.parse(args);
                } catch (validationError) {
                    return `Tool Argument Validation Failed: ${validationError.message}`;
                }
            }
        }

        // 2. Execution

        // 2a. Dynamic Tool Execution (from Skills)
        if (toolDef && (toolDef.execute || toolDef.handler)) {
            try {
                const func = toolDef.execute || toolDef.handler;
                return await func(args, this.agent); // Pass 'this.agent' as context
            } catch (e) {
                return `Error executing skill tool ${name}: ${e.message}`;
            }
        }

        // 2b. Internal Method Execution (Delegated from Agent)
        if (typeof this.agent[name] === 'function') {
            try {
                return await this.agent[name](args);
            } catch (e) {
                return `Error executing internal method ${name}: ${e.message}`;
            }
        }

        // Default Common Tools
        switch (name) {
            case 'read_file': return this.readFile(args);
            case 'write_file': return this.writeFile(args);
            default: return `Unknown tool: ${name}`;
        }
    }

    // --- Standard Tools Implementation ---

    /**
     * Resolves a path against the agent's scope and ensures it is contained within.
     * @param {string} filePath - The path to resolve.
     * @returns {string} The resolved absolute path.
     * @throws {Error} If the path is outside the scope.
     */
    _resolvePath(filePath) {
        if (!filePath) throw new Error('File path is required');

        // Resolve path relative to scope
        const resolvedPath = path.resolve(this.agent.scope, filePath);

        // Check for path traversal
        const relative = path.relative(this.agent.scope, resolvedPath);
        const isSafe = relative && (!relative.startsWith('..' + path.sep) && relative !== '..') && !path.isAbsolute(relative);
        const isRoot = relative === ''; // Allow the scope root itself

        if (!isSafe && !isRoot) {
            throw new Error(`Access denied: Path is outside the allowed scope.`);
        }

        return resolvedPath;
    }

    async readFile({ path: filePath }) {
        try {
            const fullPath = this._resolvePath(filePath);
            try {
                await fs.promises.access(fullPath);
            } catch {
                return `Error: File not found at ${filePath}`;
            }
            // Verify symlinks do not escape the scope
            const realPath = await fs.promises.realpath(fullPath);
            const relative = path.relative(this.agent.scope, realPath);
            const isSafe = relative && (!relative.startsWith('..' + path.sep) && relative !== '..') && !path.isAbsolute(relative);
            const isRoot = relative === '';
            if (!isSafe && !isRoot) {
                return `Error reading file: Access denied: Path escapes scope via symlink.`;
            }

            return await fs.promises.readFile(realPath, 'utf8');
        } catch (e) {
            return `Error reading file: ${e.message}`;
        }
    }

    async writeFile({ path: filePath, content }) {
        try {
            const fullPath = this._resolvePath(filePath);
            await fs.promises.writeFile(fullPath, content, 'utf8');
            return `Successfully wrote to ${filePath}`;
        } catch (e) {
            return `Error writing file: ${e.message}`;
        }
    }
}

module.exports = AgentToolExecutor;
