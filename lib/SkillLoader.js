const fs = require('fs');
const path = require('path');

class SkillLoader {
    constructor(skillsDir) {
        this.skillsDir = skillsDir || path.join(process.cwd(), 'skills');
        this.skills = new Map();
    }

    /**
     * Loads all skills from the skills directory, optionally filtered by tags.
     * @param {string[]} filterTags - Tags to include. If empty, all skills are loaded.
     */
    load(filterTags = []) {
        if (!fs.existsSync(this.skillsDir)) {
            console.warn(`[SkillLoader] Skills directory not found: ${this.skillsDir}`);
            return this.skills;
        }

        const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                this.loadSkill(entry.name);
            }
        }

        // Apply filtering if tags are provided
        if (filterTags.length > 0) {
            for (const [name, skill] of this.skills.entries()) {
                const skillTags = (skill.metadata.tags || '').split(',').map(t => t.trim());
                const hasMatch = skillTags.some(tag => filterTags.includes(tag)) || skillTags.includes('general') || !skill.metadata.tags;

                if (!hasMatch) {
                    this.skills.delete(name);
                }
            }
        }

        console.log(`[SkillLoader] Loaded ${this.skills.size} skills (Filters: ${filterTags.join(', ') || 'none'}).`);
        return this.skills;
    }

    /**
     * Loads a specific skill by directory name
     */
    loadSkill(dirName) {
        const skillPath = path.join(this.skillsDir, dirName, 'SKILL.md');
        if (!fs.existsSync(skillPath)) {
            return;
        }

        try {
            const content = fs.readFileSync(skillPath, 'utf8');
            const skill = this.parseSkill(dirName, content, path.join(this.skillsDir, dirName));
            if (skill) {
                this.skills.set(skill.name, skill);
            }
        } catch (e) {
            console.error(`[SkillLoader] Failed to load skill ${dirName}:`, e);
        }
    }

    /**
     * Parses the SKILL.md file
     * Minimal frontmatter parser to avoid external dependencies
     */
    parseSkill(dirName, content, fullPath) {
        const frontmatterRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---/m;
        const match = content.match(frontmatterRegex);

        if (!match) {
            console.warn(`[SkillLoader] No frontmatter found in ${dirName}/SKILL.md`);
            return null;
        }

        const frontmatterRaw = match[1];
        const metadata = {};

        frontmatterRaw.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                metadata[key] = value;
            }
        });

        if (!metadata.name) {
            console.warn(`[SkillLoader] Missing 'name' in ${dirName}/SKILL.md`);
            return null;
        }

        const skillTools = [];
        const toolsPath = path.join(fullPath, 'tools.js');
        console.log(`[SkillLoader] Checking for tools at: ${toolsPath}, exists: ${fs.existsSync(toolsPath)}`);

        if (fs.existsSync(toolsPath)) {
            try {
                const toolsModule = require(toolsPath);
                if (Array.isArray(toolsModule)) {
                    skillTools.push(...toolsModule);
                } else if (toolsModule.tools && Array.isArray(toolsModule.tools)) {
                    skillTools.push(...toolsModule.tools);
                }
                console.log(`[SkillLoader] Loaded ${skillTools.length} tools for skill: ${metadata.name}`);
            } catch (e) {
                console.error(`[SkillLoader] Failed to load tools.js for ${metadata.name}: ${e.message}`);
            }
        }

        return {
            name: metadata.name,
            description: metadata.description || '',
            path: fullPath,
            instructions: content.replace(frontmatterRegex, '').trim(),
            metadata: metadata, // Preserve other fields
            tools: skillTools // Executable tools
        };
    }

    get(name) {
        return this.skills.get(name);
    }

    getAll() {
        return Array.from(this.skills.values());
    }
}

module.exports = new SkillLoader();
