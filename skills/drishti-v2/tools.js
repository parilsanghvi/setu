const { z } = require('zod');
const { execFile } = require('child_process');
const util = require('util');
const path = require('path');
const fsPromises = require('fs/promises');
const execFileAsync = util.promisify(execFile);

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
                const { stdout } = await execFileAsync('findstr', ['/s', '/n', '/i', pattern, path.join(searchPath, '*')], { encoding: 'utf8', stdio: 'pipe' });
                return stdout || "No matches found.";
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
            try {
                async function getFiles(dirPath) {
                    const dirents = await fsPromises.readdir(dirPath, { withFileTypes: true });
                    const files = await Promise.all(dirents.map((dirent) => {
                        const res = path.resolve(dirPath, dirent.name);
                        return dirent.isDirectory() ? getFiles(res) : res;
                    }));
                    return files.flat();
                }
                const allFiles = await getFiles(dir);
                return allFiles.slice(0, 50).join('\n') + (allFiles.length > 50 ? "\n...(truncated)" : "");
            } catch (e) {
                return `Error: ${e.message}`;
            }
        }
    }
];

module.exports = tools;
