/**
 * context-builder.js — Deterministic Context Package Assembly
 *
 * Builds a "starting context package" for a task by:
 *   1. Resolving target files from a task description or explicit paths
 *   2. Walking the dependency graph (upstream + downstream)
 *   3. Assembling relevant docs into a single markdown context package
 *
 * 100% rule-based, NO LLM involvement.
 */

const fs = require('fs');
const path = require('path');
const { extractFacts } = require('./doc-facts');
const { buildGlobalRegistry, resolveFileDependencies, computeImpactMap } = require('./dependency-engine');
const { IGNORE_DIRS, TARGET_EXTS } = require('./status');

/**
 * Resolve target files from a task description by fuzzy-matching filenames.
 * @param {string} taskDescription - Free-text task description
 * @param {string} repoRoot - Absolute path to repo root
 * @returns {string[]} Array of relative file paths that match
 */
function resolveTargetFiles(taskDescription, repoRoot) {
    const matches = new Set();

    // 1. Extract explicit file paths (e.g., "lib/db.js", "agents/Guru.js")
    const pathPattern = /(?:^|\s|['"`])([a-zA-Z0-9_./-]+\.[a-zA-Z]{1,4})(?:['"`]|\s|$|,|\.)/g;
    let m;
    while ((m = pathPattern.exec(taskDescription)) !== null) {
        const candidate = m[1];
        const absPath = path.join(repoRoot, candidate);
        if (fs.existsSync(absPath)) {
            matches.add(candidate);
        }
    }

    // 2. Fuzzy match: keywords against filenames + doc Purpose sections
    if (matches.size === 0) {
        const keywords = taskDescription
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2)
            // Filter out generic action verbs
            .filter(w => !['the', 'and', 'for', 'with', 'refactor', 'update', 'fix', 'add', 'remove', 'change', 'modify'].includes(w));

        const allFiles = scanAllFiles(repoRoot);
        const scored = []; // { file, score }

        for (const relFile of allFiles) {
            const basename = path.basename(relFile, path.extname(relFile)).toLowerCase();
            const dirName = path.dirname(relFile).toLowerCase();
            let score = 0;

            // Check filename/dirname match
            for (const kw of keywords) {
                if (basename === kw) score += 3;       // exact match
                else if (basename.includes(kw)) score += 2;  // partial match
                else if (dirName.includes(kw)) score += 1;   // directory match
            }

            // Check doc Purpose section for keyword matches
            if (score === 0) {
                const docContent = readFileDoc(relFile, repoRoot);
                if (docContent) {
                    const purposeMatch = docContent.match(/## Purpose\n([\s\S]*?)(?=\n## |\n$)/);
                    if (purposeMatch) {
                        const purpose = purposeMatch[1].toLowerCase();
                        for (const kw of keywords) {
                            if (purpose.includes(kw)) {
                                score += 1;
                            }
                        }
                    }
                }
            }

            if (score > 0) {
                scored.push({ file: relFile, score });
            }
        }

        // Sort by score descending, take top 10
        scored.sort((a, b) => b.score - a.score);
        for (const { file } of scored.slice(0, 10)) {
            matches.add(file);
        }
    }

    return [...matches].sort();
}

/**
 * Scan all source files in the repo.
 */
function scanAllFiles(repoRoot, dir = '') {
    const results = [];
    const absDir = path.join(repoRoot, dir);

    let entries;
    try { entries = fs.readdirSync(absDir, { withFileTypes: true }); }
    catch (_) { return results; }

    for (const entry of entries) {
        if (IGNORE_DIRS.includes(entry.name)) continue;
        if (entry.name.startsWith('.')) continue;

        const relPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            results.push(...scanAllFiles(repoRoot, relPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (TARGET_EXTS.includes(ext)) {
                results.push(relPath);
            }
        }
    }

    return results;
}

/**
 * Walk dependencies from a set of target files.
 * @param {string[]} targetFiles - Relative file paths
 * @param {string} repoRoot - Repo root
 * @param {number} depth - How many hops to walk (default: 2)
 * @returns {{ upstream: Map, downstream: Map, allFiles: Set }}
 */
function walkDependencies(targetFiles, repoRoot, depth = 2) {
    // Build global facts
    const allSourceFiles = scanAllFiles(repoRoot);
    const allFacts = allSourceFiles.map(f => {
        try { return extractFacts(path.join(repoRoot, f), repoRoot); }
        catch (_) { return null; }
    }).filter(Boolean);

    const globalRegistry = buildGlobalRegistry(allFacts);
    const impactMap = computeImpactMap(allFacts, globalRegistry);

    // Build import index: file -> [files it imports]
    const importIndex = new Map();
    for (const facts of allFacts) {
        const imports = (facts.imports || [])
            .filter(i => i.isLocal && i.resolved)
            .map(i => i.resolved);
        importIndex.set(facts.file, imports);
    }

    // BFS upstream (what do targets depend on?)
    const upstream = new Map(); // targetFile -> Set of upstream files
    const downstream = new Map(); // targetFile -> Set of downstream files
    const allRelated = new Set(targetFiles);

    for (const target of targetFiles) {
        // Upstream walk
        const upstreamSet = new Set();
        let frontier = [target];
        for (let d = 0; d < depth; d++) {
            const nextFrontier = [];
            for (const file of frontier) {
                const deps = importIndex.get(file) || [];
                for (const dep of deps) {
                    if (!upstreamSet.has(dep) && dep !== target) {
                        upstreamSet.add(dep);
                        allRelated.add(dep);
                        nextFrontier.push(dep);
                    }
                }
            }
            frontier = nextFrontier;
        }
        upstream.set(target, upstreamSet);

        // Downstream walk (who imports this file?)
        const downstreamSet = new Set();
        frontier = [target];
        for (let d = 0; d < depth; d++) {
            const nextFrontier = [];
            for (const file of frontier) {
                // Find who imports this file
                for (const [sourceFile, imports] of importIndex.entries()) {
                    if (imports.includes(file) && !downstreamSet.has(sourceFile) && sourceFile !== target) {
                        downstreamSet.add(sourceFile);
                        allRelated.add(sourceFile);
                        nextFrontier.push(sourceFile);
                    }
                }
            }
            frontier = nextFrontier;
        }
        downstream.set(target, downstreamSet);
    }

    return { upstream, downstream, allFiles: allRelated, impactMap };
}

/**
 * Read a file's documentation from docs/files/.
 * @param {string} relPath - Relative file path
 * @param {string} repoRoot - Repo root
 * @returns {string|null} Doc content or null
 */
function readFileDoc(relPath, repoRoot) {
    const docPath = path.join(repoRoot, 'docs/files', `${relPath}.md`);
    if (fs.existsSync(docPath)) {
        return fs.readFileSync(docPath, 'utf8');
    }
    return null;
}

/**
 * Extract the Purpose and Exports sections from a doc file.
 */
function extractDocSections(docContent) {
    if (!docContent) return { purpose: 'No documentation available.', exports: '', sideEffects: '' };

    // Strip frontmatter
    let content = docContent.replace(/^---\n[\s\S]*?\n---\n/m, '');

    const purposeMatch = content.match(/## Purpose\n([\s\S]*?)(?=\n## |\n$)/);
    const exportsMatch = content.match(/## Exports.*?\n([\s\S]*?)(?=\n## |\n$)/);
    const sideEffectsMatch = content.match(/## Side Effects\n([\s\S]*?)(?=\n## |\n$)/);
    const symbolDepsMatch = content.match(/## Symbol Dependencies\n([\s\S]*?)$/);

    return {
        purpose: purposeMatch ? purposeMatch[1].trim() : 'No purpose documented.',
        exports: exportsMatch ? exportsMatch[1].trim() : '',
        sideEffects: sideEffectsMatch ? sideEffectsMatch[1].trim() : '',
        symbolDeps: symbolDepsMatch ? symbolDepsMatch[1].trim() : '',
    };
}

/**
 * Build a complete context package for a task.
 * @param {Object} opts
 * @param {string[]} opts.targetFiles - Relative file paths (or will be resolved from task)
 * @param {string} [opts.taskDescription] - Free-text task description
 * @param {string} opts.repoRoot - Repo root
 * @param {number} [opts.depth=2] - Dependency walk depth
 * @returns {string} Markdown context package
 */
function buildContextPackage({ targetFiles, taskDescription, repoRoot, depth = 2 }) {
    // Resolve files if not provided
    if (!targetFiles || targetFiles.length === 0) {
        if (taskDescription) {
            targetFiles = resolveTargetFiles(taskDescription, repoRoot);
        }
        if (!targetFiles || targetFiles.length === 0) {
            return '# Context Package\n\n> ⚠️ No target files could be resolved from the task description.\n';
        }
    }

    // Walk dependencies
    const { upstream, downstream } = walkDependencies(targetFiles, repoRoot, depth);

    // Build the package
    const sections = [];

    sections.push(`# Context Package`);
    if (taskDescription) {
        sections.push(`\n> **Task**: ${taskDescription}`);
    }
    sections.push(`\n> Generated at ${new Date().toISOString()} | Depth: ${depth} hops | Rule-based (no LLM)\n`);

    // --- Target Files ---
    sections.push(`## 🎯 Target Files\n`);

    for (const file of targetFiles) {
        const doc = extractDocSections(readFileDoc(file, repoRoot));
        sections.push(`### ${file}\n`);
        sections.push(`**Purpose**: ${doc.purpose}\n`);

        if (doc.exports) {
            sections.push(`<details><summary>Exports</summary>\n\n${doc.exports}\n</details>\n`);
        }
        if (doc.sideEffects) {
            sections.push(`<details><summary>Side Effects</summary>\n\n${doc.sideEffects}\n</details>\n`);
        }
    }

    // --- Upstream Dependencies ---
    sections.push(`## ⬆️ Upstream Dependencies (what targets depend on)\n`);

    let hasUpstream = false;
    for (const [target, deps] of upstream.entries()) {
        if (deps.size === 0) continue;
        hasUpstream = true;
        sections.push(`### From ${target}:\n`);
        sections.push(`| File | Purpose |`);
        sections.push(`| --- | --- |`);
        for (const dep of [...deps].sort()) {
            const doc = extractDocSections(readFileDoc(dep, repoRoot));
            const shortPurpose = doc.purpose.split('.')[0] + '.';
            sections.push(`| \`${dep}\` | ${shortPurpose} |`);
        }
        sections.push('');
    }
    if (!hasUpstream) {
        sections.push('*No upstream dependencies detected.*\n');
    }

    // --- Downstream Impact ---
    sections.push(`## ⬇️ Downstream Impact (files that MAY need changes)\n`);

    let hasDownstream = false;
    for (const [target, deps] of downstream.entries()) {
        if (deps.size === 0) continue;
        hasDownstream = true;
        sections.push(`### Files depending on ${target}:\n`);
        sections.push(`| File | Purpose |`);
        sections.push(`| --- | --- |`);
        for (const dep of [...deps].sort()) {
            const doc = extractDocSections(readFileDoc(dep, repoRoot));
            const shortPurpose = doc.purpose.split('.')[0] + '.';
            sections.push(`| \`${dep}\` | ${shortPurpose} |`);
        }
        sections.push('');
    }
    if (!hasDownstream) {
        sections.push('*No downstream dependents detected.*\n');
    }

    // --- Conventions ---
    const convPath = path.join(repoRoot, 'docs/CONVENTIONS.md');
    if (fs.existsSync(convPath)) {
        const convContent = fs.readFileSync(convPath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/m, '');
        sections.push(`## 📏 Coding Conventions\n`);
        sections.push(`<details><summary>Click to expand</summary>\n\n${convContent.trim()}\n</details>\n`);
    }

    return sections.join('\n');
}

/**
 * Build a JSON-structured context package.
 */
function buildContextJSON({ targetFiles, taskDescription, repoRoot, depth = 2 }) {
    if (!targetFiles || targetFiles.length === 0) {
        if (taskDescription) {
            targetFiles = resolveTargetFiles(taskDescription, repoRoot);
        }
    }
    if (!targetFiles || targetFiles.length === 0) {
        return { error: 'No target files resolved', targets: [] };
    }

    const { upstream, downstream } = walkDependencies(targetFiles, repoRoot, depth);

    const targets = targetFiles.map(file => {
        const doc = extractDocSections(readFileDoc(file, repoRoot));
        return {
            file,
            purpose: doc.purpose,
            exports: doc.exports,
            sideEffects: doc.sideEffects,
            upstream: [...(upstream.get(file) || [])].sort(),
            downstream: [...(downstream.get(file) || [])].sort(),
        };
    });

    return {
        task: taskDescription || null,
        generated_at: new Date().toISOString(),
        depth,
        target_count: targetFiles.length,
        targets,
    };
}

module.exports = {
    resolveTargetFiles,
    walkDependencies,
    buildContextPackage,
    buildContextJSON,
    scanAllFiles,
};
