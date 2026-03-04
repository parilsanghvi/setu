/**
 * doc-facts.js — Deterministic Fact Extraction Layer
 *
 * Parses source files with lightweight regex heuristics (language-agnostic).
 * Produces structured JSON facts with NO LLM involvement.
 * Results are deterministic: stable ordering, normalized paths.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const { IGNORE_DIRS, TARGET_EXTS } = require('./status');

// ─── Language-agnostic regex patterns ───────────────────────────────────────

const EXPORT_PATTERNS = [
    // CommonJS
    { re: /module\.exports\s*=\s*(\w+)/g, type: 'cjs_default' },
    { re: /module\.exports\s*=\s*new\s+(\w+)/g, type: 'cjs_instance' },
    { re: /module\.exports\s*=\s*\{([^}]+)\}/gs, type: 'cjs_named' },
    { re: /exports\.(\w+)\s*=/g, type: 'cjs_prop' },
    // ES Modules
    { re: /export\s+default\s+(?:class|function|const|let|var)?\s*(\w+)/g, type: 'esm_default' },
    { re: /export\s+(?:const|let|var|function|class|async\s+function)\s+(\w+)/g, type: 'esm_named' },
    { re: /export\s*\{([^}]+)\}/g, type: 'esm_destructured' },
];

const IMPORT_PATTERNS = [
    // CommonJS
    { re: /(?:const|let|var)\s+(?:\{[^}]+\}|\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, type: 'cjs' },
    // ES Modules
    { re: /import\s+(?:(?:\{[^}]+\}|\w+|\* as \w+)\s+from\s+)?['"]([^'"]+)['"]/g, type: 'esm' },
];

const SIDE_EFFECT_PATTERNS = [
    { re: /\bfs\.\w*(write|append|unlink|mkdir|rmdir|rm|rename)\w*/gi, type: 'filesystem_write' },
    { re: /\bfs\.\w*(read|exists|stat|access)\w*/gi, type: 'filesystem_read' },
    { re: /\b(fetch|axios|https?\.(?:get|post|put|delete|request))\b/gi, type: 'network' },
    { re: /\b(?:process\.env)\b/g, type: 'env_access' },
    { re: /\bglobal\.\w+\s*=/g, type: 'global_mutation' },
    { re: /\b(?:db|database|sql|query|prepare|exec|run)\b.*?\(/gi, type: 'database' },
    { re: /\bchild_process\b|\b(?:exec|spawn|fork|execSync|spawnSync)\s*\(/g, type: 'subprocess' },
    { re: /\bconsole\.(log|warn|error|info)\b/g, type: 'console_output' },
    { re: /\bprocess\.(exit|kill)\b/g, type: 'process_control' },
];

const FUNCTION_PATTERNS = [
    // JS/TS functions
    { re: /(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g, type: 'function' },
    // Arrow / const functions
    { re: /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(?([^)=]*)\)?\s*=>/g, type: 'arrow' },
    // Class methods
    { re: /^\s+(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*\{/gm, type: 'method' },
    // Python functions
    { re: /def\s+(\w+)\s*\(([^)]*)\)/g, type: 'py_function' },
    // Python classes
    { re: /class\s+(\w+)(?:\(([^)]*)\))?:/g, type: 'py_class' },
];

const CLASS_PATTERNS = [
    { re: /class\s+(\w+)(?:\s+extends\s+(\w+))?/g, type: 'class' },
];

const CALL_PATTERNS = [
    // functionName()
    { re: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, type: 'direct_call' },
    // object.methodName()
    { re: /\b[a-zA-Z_][a-zA-Z0-9_]*\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, type: 'member_call' },
];

const BUILT_IN_SYMBOLS = new Set([
    'require', 'import', 'export', 'module', 'console', 'process', 'global', 'window', 'document',
    'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Map', 'Set', 'JSON', 'Math', 'Date', 'Error',
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'fetch', 'axios', 'execSync', 'spawnSync',
    'path', 'fs', 'crypto', 'os', 'http', 'https', 'assert', 'util', 'events', 'url', 'querystring', 'stream', 'zlib',
    'Buffer'
]);

// ─── Core extraction ────────────────────────────────────────────────────────

/**
 * Extract all facts from a single source file.
 * @param {string} filePath - Absolute path to the source file.
 * @param {string} repoRoot - Absolute path to the repo root.
 * @returns {Object} Structured facts JSON.
 */
function extractFacts(filePath, repoRoot) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(repoRoot, filePath);
    const ext = path.extname(filePath);

    const facts = {
        file: relPath,
        extension: ext,
        lines: content.split('\n').length,
        source_hash: hashContent(content),
        extracted_at: new Date().toISOString(),
        symbols: extractSymbols(content),
        imports: extractImports(content, relPath, repoRoot),
        exports: extractExports(content),
        calls: extractCalls(content),
        dependents: findDependents(relPath, repoRoot),
        sideEffects: extractSideEffects(content),
        confidence: 'high',
    };

    // Lower confidence if file is very large or has unusual patterns
    if (facts.lines > 500) facts.confidence = 'medium';
    if (facts.symbols.length === 0 && facts.exports.length === 0) facts.confidence = 'low';

    return facts;
}

function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function extractSymbols(content) {
    const symbols = [];
    const seen = new Set();

    for (const pat of FUNCTION_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            const name = m[1];
            if (!seen.has(name) && name !== 'constructor' && !name.startsWith('_')) {
                seen.add(name);
                symbols.push({
                    name,
                    type: pat.type,
                    params: (m[2] || '').split(',').map(p => p.trim()).filter(Boolean),
                });
            }
        }
    }

    for (const pat of CLASS_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            const name = m[1];
            if (!seen.has(name)) {
                seen.add(name);
                symbols.push({
                    name,
                    type: 'class',
                    extends: m[2] || null,
                });
            }
        }
    }

    // Stable sort by name
    symbols.sort((a, b) => a.name.localeCompare(b.name));
    return symbols;
}

function extractImports(content, relPath, repoRoot) {
    const imports = [];
    const seen = new Set();

    for (const pat of IMPORT_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            const raw = m[1];
            if (seen.has(raw)) continue;
            seen.add(raw);

            const isRelative = raw.startsWith('.');
            let resolved = raw;

            if (isRelative) {
                const dir = path.dirname(relPath);
                resolved = path.normalize(path.join(dir, raw));
                // Normalize away leading ./
                if (resolved.startsWith('/')) resolved = resolved.slice(1);

                // Resolve actual file extension by probing the filesystem
                // Node.js omits extensions in require/import, we need the real file
                const absResolved = path.join(repoRoot, resolved);
                if (!fs.existsSync(absResolved) || fs.statSync(absResolved).isDirectory()) {
                    const PROBE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json'];
                    for (const ext of PROBE_EXTS) {
                        if (fs.existsSync(absResolved + ext)) {
                            resolved = resolved + ext;
                            break;
                        }
                    }
                    // Also check for index files in directories
                    if (fs.existsSync(absResolved) && fs.statSync(absResolved).isDirectory()) {
                        for (const ext of PROBE_EXTS) {
                            if (fs.existsSync(path.join(absResolved, `index${ext}`))) {
                                resolved = resolved + `/index${ext}`;
                                break;
                            }
                        }
                    }
                }
            }

            imports.push({
                raw,
                resolved: isRelative ? resolved : null,
                isLocal: isRelative,
                isExternal: !isRelative,
            });
        }
    }

    imports.sort((a, b) => a.raw.localeCompare(b.raw));
    return imports;
}

function extractExports(content) {
    const exports = [];
    const seen = new Set();

    for (const pat of EXPORT_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            if (pat.type === 'cjs_named' || pat.type === 'esm_destructured') {
                // Parse destructured exports: { a, b, c }
                const inner = m[1];
                const names = inner.split(',').map(s => s.trim().split(/\s+as\s+/).pop().trim()).filter(Boolean);
                for (const name of names) {
                    if (!seen.has(name)) {
                        seen.add(name);
                        exports.push({ name, type: pat.type });
                    }
                }
            } else {
                const name = m[1];
                if (name && !seen.has(name)) {
                    seen.add(name);
                    exports.push({ name, type: pat.type });
                }
            }
        }
    }

    // Also treat all class methods as "pseudo-exports" for the global symbol registry
    // This allows resolving db.send() to lib/db.js
    const methodRe = /^\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm;
    let m;
    while ((m = methodRe.exec(content)) !== null) {
        const name = m[1];
        if (!seen.has(name) && name !== 'constructor' && !name.startsWith('_')) {
            seen.add(name);
            exports.push({ name, type: 'method' });
        }
    }

    exports.sort((a, b) => a.name.localeCompare(b.name));
    return exports;
}

function extractSideEffects(content) {
    const effects = [];
    const seen = new Set();

    for (const pat of SIDE_EFFECT_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            if (!seen.has(pat.type)) {
                seen.add(pat.type);
                effects.push(pat.type);
            }
        }
    }

    effects.sort();
    return effects;
}

function extractCalls(content) {
    const calls = new Set();
    const definedSymbols = new Set();

    // Find all defined symbols in this file to ignore them (internal calls)
    for (const pat of FUNCTION_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            definedSymbols.add(m[1]);
        }
    }
    for (const pat of CLASS_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            definedSymbols.add(m[1]);
        }
    }

    // Extract all call sites
    for (const pat of CALL_PATTERNS) {
        let m;
        const re = new RegExp(pat.re.source, pat.re.flags);
        while ((m = re.exec(content)) !== null) {
            const name = m[1];
            if (name && !BUILT_IN_SYMBOLS.has(name) && !definedSymbols.has(name) && !name.startsWith('_')) {
                calls.add(name);
            }
        }
    }

    return [...calls].sort();
}

/**
 * Find files that import/require the given file.
 * Uses git grep for speed when available, falls back to manual scan.
 * @param {string} relPath - Relative path of the file from repo root.
 * @param {string} repoRoot - Absolute path to the repo root.
 * @returns {string[]} Sorted list of dependent relative paths.
 */
function findDependents(relPath, repoRoot) {
    const basename = path.basename(relPath, path.extname(relPath));
    const dirPath = path.dirname(relPath);
    const dependents = new Set();

    // Build search patterns for this file
    const searchTerms = [
        // require('./Module') or require('../lib/Module')
        `require('${relPath.replace(/\\/g, '/')}`,
        `require("./${basename}")`,
        `require('./${basename}')`,
        // import from patterns
        `from '${relPath.replace(/\\/g, '/')}`,
        `from "./${basename}"`,
        `from './${basename}'`,
    ];

    // Also add relative path variants without extension
    const relNoExt = relPath.replace(/\.[^.]+$/, '').replace(/\\/g, '/');
    searchTerms.push(`require('./${relNoExt}')`);
    searchTerms.push(`require("./${relNoExt}")`);

    try {
        // Use git grep for speed
        for (const term of searchTerms) {
            try {
                const output = execSync(
                    `git grep -l "${term.replace(/"/g, '\\"')}" -- '*.js' '*.ts' '*.tsx' '*.jsx' '*.py'`,
                    { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
                );
                output.split('\n').filter(Boolean).forEach(f => {
                    const normalized = path.normalize(f);
                    if (normalized !== relPath) dependents.add(normalized);
                });
            } catch (_) { /* no matches for this pattern */ }
        }
    } catch (_) {
        // git grep not available, skip dependents
    }

    return [...dependents].sort();
}

/**
 * Extract facts for a folder by aggregating its children's facts.
 * @param {string} folderPath - Absolute path to the folder.
 * @param {string} repoRoot - Absolute path to the repo root.
 * @returns {Object} Folder-level facts.
 */
function extractFolderFacts(folderPath, repoRoot) {
    const relPath = path.relative(repoRoot, folderPath);
    let entries;
    try {
        entries = fs.readdirSync(folderPath, { withFileTypes: true });
    } catch (e) {
        return { folder: relPath, files: [], subfolders: [], confidence: 'low' };
    }

    const files = [];
    const subfolders = [];

    for (const entry of entries) {
        if (IGNORE_DIRS.includes(entry.name)) continue;
        const fullPath = path.join(folderPath, entry.name);
        const entryRel = path.relative(repoRoot, fullPath);

        if (entryRel.startsWith('docs')) continue;

        if (entry.isDirectory()) {
            subfolders.push(entry.name);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (TARGET_EXTS.includes(ext) && !entry.name.endsWith('.min.js') && !entry.name.endsWith('lock.json')) {
                files.push({
                    name: entry.name,
                    relPath: entryRel,
                    size: fs.statSync(fullPath).size,
                });
            }
        }
    }

    files.sort((a, b) => a.name.localeCompare(b.name));
    subfolders.sort();

    return {
        folder: relPath,
        files,
        subfolders,
        fileCount: files.length,
        subfolderCount: subfolders.length,
        confidence: files.length > 0 ? 'high' : 'medium',
    };
}

module.exports = {
    extractFacts,
    extractFolderFacts,
    hashContent,
    extractSymbols,
    extractImports,
    extractExports,
    extractSideEffects,
    findDependents,
    extractCalls,
};
