const { z } = require('zod');
const { execSync } = require('child_process');
const path = require('path');

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
                // Windows 'findstr' or 'grep' if available. let's assume git bash or standard windows
                // findstr /s /n "pattern" *
                const cmd = `findstr /s /n /i "${pattern}" "${path.join(searchPath, '*')}"`;
                const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
                return output || "No matches found.";
            } catch (e) {
                // findstr returns exit code 1 if no match, which throws error in execSync
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
            dir: z.string().optional().default('.')
        }),
        execute: async ({ dir }) => {
            // PowerShell or dir /s /b
            try {
                const cmd = `dir /s /b "${dir}"`;
                const output = execSync(cmd, { encoding: 'utf8' });
                return output.split('\r\n').slice(0, 50).join('\n') + "\n...(truncated)";
            } catch (e) {
                return `Error: ${e.message}`;
            }
        }
    }
];

module.exports = tools;
