const Logger = require('./Logger');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class SkillLoader {
    constructor(skillsDir) {
        this.skillsDir = skillsDir || path.join(process.cwd(), 'skills');
        this.skills = new Map();
        this._cache = null; // Cache for all skills to avoid repeated FS reads
        this.logger = new Logger('SkillLoader');
    }

    /**
     * Loads all skills from the skills directory, optionally filtered by tags.
     * @param {string[]} filterTags - Tags to include. If empty, all skills are loaded.
     */
    load(filterTags = []) {
        this._ensureCache();

        // Start with empty map for result
        this.skills = new Map();

        // Apply filtering from cache
        for (const [name, skill] of this._cache.entries()) {
            let skillTags = [];
            const tagsRaw = skill.metadata.tags;

            if (Array.isArray(tagsRaw)) {
                skillTags = tagsRaw;
            } else if (typeof tagsRaw === 'string') {
                skillTags = tagsRaw.split(',').map(t => t.trim());
            }

            const hasMatch = (filterTags.length === 0) ||
                             skillTags.some(tag => filterTags.includes(tag)) ||
                             skillTags.includes('general') ||
                             !tagsRaw;

            if (hasMatch) {
                this.skills.set(name, skill);
            }
        }

        this.logger.info(`Loaded ${this.skills.size} skills (Filters: ${filterTags.join(', ') || 'none'}).`);
        return this.skills;
    }

    _ensureCache() {
        if (this._cache) return;

        this._cache = new Map();

        if (!fs.existsSync(this.skillsDir)) {
            this.logger.warn(`Skills directory not found: ${this.skillsDir}`);
            return;
        }

        const entries = fs.readdirSync(this.skillsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                this.loadSkill(entry.name, this._cache);
            }
        }
        this.logger.info(`Initial load complete. Cached ${this._cache.size} skills.`);
    }

    /**
     * Loads a specific skill by directory name
     * @param {string} dirName - The directory name of the skill
     * @param {Map} targetMap - The map to store the loaded skill in (defaults to this.skills for backward compatibility)
     */
    loadSkill(dirName, targetMap) {
        const mapToUpdate = targetMap || this.skills;
        const skillPath = path.join(this.skillsDir, dirName, 'SKILL.md');
        if (!fs.existsSync(skillPath)) {
            return;
        }

        try {
            const content = fs.readFileSync(skillPath, 'utf8');
            const skill = this.parseSkill(dirName, content, path.join(this.skillsDir, dirName));
            if (skill) {
                mapToUpdate.set(skill.name, skill);
            }
        } catch (e) {
            this.logger.error(`Failed to load skill ${dirName}:`, e);
        }
    }

    /**
     * Parses the SKILL.md file
     * Uses gray-matter for robust frontmatter parsing
     */
    parseSkill(dirName, content, fullPath) {
        let parsed;
        try {
            parsed = matter(content);
        } catch (e) {
            this.logger.warn(`Failed to parse frontmatter in ${dirName}/SKILL.md: ${e.message}`);
            return null;
        }

        const metadata = parsed.data;

        // Check if frontmatter exists (keys > 0)
        if (!metadata || Object.keys(metadata).length === 0) {
            this.logger.warn(`No frontmatter found in ${dirName}/SKILL.md`);
            return null;
        }

        if (!metadata.name) {
            this.logger.warn(`Missing 'name' in ${dirName}/SKILL.md`);
            return null;
        }

        const skillTools = [];
        const toolsPath = path.join(fullPath, 'tools.js');
        this.logger.info(`Checking for tools at: ${toolsPath}, exists: ${fs.existsSync(toolsPath)}`);

        if (fs.existsSync(toolsPath)) {
            try {
                const toolsModule = require(toolsPath);
                if (Array.isArray(toolsModule)) {
                    skillTools.push(...toolsModule);
                } else if (toolsModule.tools && Array.isArray(toolsModule.tools)) {
                    skillTools.push(...toolsModule.tools);
                }
                this.logger.info(`Loaded ${skillTools.length} tools for skill: ${metadata.name}`);
            } catch (e) {
                this.logger.error(`Failed to load tools.js for ${metadata.name}: ${e.message}`);
            }
        }

        return {
            name: metadata.name,
            description: metadata.description || '',
            path: fullPath,
            instructions: parsed.content.trim(),
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

const loader = new SkillLoader();
loader.SkillLoader = SkillLoader;
module.exports = loader;
