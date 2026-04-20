const { z } = require('zod');
const { execFile } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs');
const execFileAsync = util.promisify(execFile);

async function walkDir(dir) {
    let results = [];
    const list = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of list) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(await walkDir(fullPath));
        } else {
            results.push(fullPath);
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
            path: z.string().default('.')
        }),
        execute: async ({ pattern, path: searchPath }) => {
            try {
                // Windows 'findstr' or 'grep' if available. let's assume git bash or standard windows
                // We use execFile to prevent shell injection.
                // findstr /s /n "pattern" *
                const { stdout } = await execFileAsync('findstr', ['/s', '/n', '/i', pattern, path.join(searchPath, '*')], { encoding: 'utf8' });
                return stdout || "No matches found.";
            } catch (e) {
                // findstr returns exit code 1 if no match
                return "No matches found.";
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
            dir: z.string().default('.')
        }),
        execute: async ({ dir }) => {
            try {
                const files = await walkDir(dir);
                return files.slice(0, 50).join('\n') + (files.length > 50 ? '\n...(truncated)' : '');
            } catch (e) {
                return `Error: ${e.message}`;
            }
        }
    }
];

module.exports = tools;
