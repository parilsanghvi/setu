const { z } = require('zod');
const fs = require('fs');
const path = require('path');

async function walkDir(dir, pattern = null, results = []) {
    const list = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const dirent of list) {
        if (dirent.name === 'node_modules' || dirent.name === '.git') continue;
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            await walkDir(res, pattern, results);
        } else {
            if (pattern) {
                try {
                    const content = await fs.promises.readFile(res, 'utf8');
                    const lines = content.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].toLowerCase().includes(pattern.toLowerCase())) {
                            results.push(`${res}:${i + 1}:${lines[i].trim()}`);
                        }
                    }
                } catch (e) { } // ignore unreadable/binary files
            } else {
                results.push(res);
            }
        }
    }
    return results;
}

const tools = [
    {
        name: 'search_code',
        description: 'Search for a string pattern in the codebase using grep.',
        parameters: {
            type: 'object',
            properties: {
                pattern: { type: 'string', description: 'The text or regex to search for.' },
                path: { type: 'string', description: 'Directory to search in (default: .)' }
            },
            required: ['pattern']
        },
        schema: z.object({
            pattern: z.string(),
            path: z.string().optional().default('.')
        }),
        execute: async ({ pattern, path: searchPath }) => {
            try {
                const resolvedDir = path.resolve(searchPath);
                const results = await walkDir(resolvedDir, pattern);
                if (results.length === 0) return "No matches found.";
                return results.slice(0, 50).join('\n') + (results.length > 50 ? "\n...(truncated)" : "");
            } catch (e) {
                return `Error: ${e.message}`;
            }
        }
    },
    {
        name: 'list_files_recursive',
        description: 'recursively list all files in directory.',
        parameters: {
            type: 'object',
            properties: {
                dir: { type: 'string', description: 'Directory to list' }
            }
        },
        schema: z.object({
            dir: z.string().optional().default('.')
        }),
        execute: async ({ dir }) => {
            try {
                const resolvedDir = path.resolve(dir);
                const results = await walkDir(resolvedDir);
                return results.slice(0, 50).join('\n') + (results.length > 50 ? "\n...(truncated)" : "");
            } catch (e) {
                return `Error: ${e.message}`;
            }
        }
    }
];

module.exports = tools;
