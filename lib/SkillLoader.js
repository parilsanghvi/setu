const fs = require('fs');
const path = require('path');

class SkillLoader {
    constructor(skillsDir) {
        this.skillsDir = skillsDir || path.join(process.cwd(), 'skills');
        this.skills = new Map();
    }

    /**
     * Loads all skills from the skills directory
     */
    load() {
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

        console.log(`[SkillLoader] Loaded ${this.skills.size} skills.`);
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
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/m;
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

        return {
            name: metadata.name,
            description: metadata.description || '',
            path: fullPath,
            instructions: content.replace(frontmatterRegex, '').trim(),
            metadata: metadata // Preserve other fields
        };
    }

    get(name) {
        return this.skills.get(name);
    }

    getAll() {
        return Array.from(this.skills.values());
    }
}

module.exports = SkillLoader;
