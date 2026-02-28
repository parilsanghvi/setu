/**
 * doc-enricher.js — Two-Pass LLM-Powered Documentation Generator
 *
 * Pass 1: Deterministic fact extraction (doc-facts.js)
 * Pass 2: LLM enrichment with facts + source context
 *
 * Produces dense, agent-optimized documentation with cross-references.
 * Generalizable to any repo — no project-specific hardcoding.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const { extractFacts, extractFolderFacts, hashContent } = require('./doc-facts');
const { IGNORE_DIRS, TARGET_EXTS } = require('./status');
const { fileDocPath, folderDocPath, relativeLink, fileLink, folderLink, safeLinkToFile, safeLinkToFolder } = require('./doc-links');

const GENERATOR_VERSION = '1.0.0';

// ─── Secret Redaction (Workstream 7) ────────────────────────────────────────

const SECRET_PATTERNS = [
    /(?:api[_-]?key|apikey|secret|token|password|passwd|credentials?|auth[_-]?token)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /(?:sk|pk|rk|ak)[-_][a-zA-Z0-9]{20,}/g,
    /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}/g,
    /(?:AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}/g,
    /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g,
    /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/g,
];

function redactSecrets(text) {
    let redacted = text;
    let redactionCount = 0;

    for (const pattern of SECRET_PATTERNS) {
        const re = new RegExp(pattern.source, pattern.flags);
        redacted = redacted.replace(re, () => {
            redactionCount++;
            return '<!-- REDACTED: sensitive content omitted -->';
        });
    }

    return { text: redacted, redactionCount };
}

// ─── Frontmatter / Fingerprinting (Workstream 4) ───────────────────────────

function buildFrontmatter(meta) {
    return [
        '---',
        `source_hash: ${meta.source_hash}`,
        `facts_hash: ${meta.facts_hash}`,
        `generated_at: ${meta.generated_at}`,
        `generator_version: ${meta.generator_version}`,
        `model: ${meta.model || 'unknown'}`,
        `quality_score: ${meta.quality_score || 0}`,
        '---',
        '',
    ].join('\n');
}

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) return null;

    const meta = {};
    match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(': ');
        if (key) meta[key.trim()] = rest.join(': ').trim();
    });
    return meta;
}

function shouldSkipFile(docPath, sourceHash, force) {
    if (force) return false;
    if (!fs.existsSync(docPath)) return false;

    try {
        const existing = fs.readFileSync(docPath, 'utf8');
        const meta = parseFrontmatter(existing);
        if (!meta) return false;

        // Skip if source hasn't changed
        if (meta.source_hash === sourceHash) return true;
    } catch (_) { }

    return false;
}

// ─── LLM Prompt Construction ───────────────────────────────────────────────

function buildFileDocPrompt(facts, sourceExcerpt, repoRoot) {
    const { text: safeSource, redactionCount } = redactSecrets(sourceExcerpt);

    // Pre-build the imports table with an example row
    const importsTable = facts.imports.length > 0
        ? '| Module | Local | Why |\n|--------|-------|-----|\n| `example` | Yes | Provides helper utilities |\n' +
        facts.imports.map(i => `| \`${i.raw}\` | ${i.isLocal ? 'Yes' : 'No'} | `).join('\n')
        : 'No imports detected.';

    // Pre-build exports table with an example row
    const exportsTable = facts.exports.length > 0
        ? '| Export | Type | Description |\n|--------|------|-------------|\n| `example` | function | Handles incoming requests and returns a response |\n' +
        facts.exports.map(e => `| \`${e.name}\` | ${e.type} | `).join('\n')
        : (facts.symbols.length > 0
            ? '| Symbol | Type | Params | Description |\n|--------|------|--------|-------------|\n| `example` | function | `req, res` | Handles incoming requests |\n' +
            facts.symbols.slice(0, 15).map(s => {
                const params = s.params ? s.params.join(', ') : '';
                return `| \`${s.name}\` | ${s.type} | \`${params}\` | `;
            }).join('\n')
            : 'No exports or symbols detected.');

    return `You are documenting a source file. Read the code carefully and write accurate documentation.

OUTPUT FORMAT: Start IMMEDIATELY with ## Purpose. Do not write anything before ## Purpose. No introductions, no preamble. Do not output any links. Do not repeat these instructions. Stop after ## Side Effects.
${redactionCount > 0 ? `NOTE: ${redactionCount} secret(s) were redacted from the source. Mention this in Side Effects.\n` : ''}
FILE: ${facts.file} (${facts.lines} lines)

SOURCE CODE:
\`\`\`
${safeSource}
\`\`\`

## Purpose
Write 2-3 sentences explaining what this file does and its role in the system. Be specific — mention the actual class/function names and what they accomplish.

## Exports / API Surface
Fill in EVERY Description cell in this table. Delete the example row. Each description should say what the export does in one sentence.
${exportsTable}

## Internal Logic
Describe the main execution flow. Name the key functions and explain what each one does. If the file defines a class, describe its constructor and main methods. Do not write "Straightforward" unless the file is under 20 lines.

## Dependencies
Fill in EVERY Why cell in this table. Delete the example row. Each Why should explain the purpose of the import in one phrase.
${importsTable}

## Side Effects
${facts.sideEffects.length > 0 ? 'Describe each side effect with specifics:\n' + facts.sideEffects.map(e => `- ${e}: `).join('\n') : 'None detected.'}

STOP HERE. Do not write anything after ## Side Effects. Do not write ## Dependents or ## Cross-References.`;
}

/**
 * Build deterministic Dependents + Cross-References sections for a file doc.
 * These are NEVER generated by the LLM — always computed from facts.
 * Uses safe links that degrade to plain text when the target doc doesn't exist.
 */
function buildDeterministicFileSections(facts, repoRoot) {
    const currentDocPath = fileDocPath(facts.file);
    const sections = [];

    // Dependents section
    sections.push('## Dependents');
    if (facts.dependents.length > 0) {
        facts.dependents.forEach(d => {
            sections.push(`- ${safeLinkToFile(d, currentDocPath, repoRoot)}`);
        });
    } else {
        sections.push('No known dependents.');
    }
    sections.push('');

    // Cross-References section
    sections.push('## Cross-References');
    const seen = new Set();
    const refs = [];
    facts.imports.filter(i => i.isLocal && i.resolved).forEach(i => {
        const key = i.resolved;
        if (seen.has(key)) return;
        seen.add(key);
        refs.push(`- ${safeLinkToFile(i.resolved, currentDocPath, repoRoot)}`);
    });
    facts.dependents.forEach(d => {
        if (seen.has(d)) return;
        seen.add(d);
        refs.push(`- ${safeLinkToFile(d, currentDocPath, repoRoot)}`);
    });
    if (refs.length > 0) {
        sections.push(...refs);
    } else {
        sections.push('No cross-references.');
    }

    return sections.join('\n');
}

function buildFolderDocPrompt(folderFacts, childDocSummaries, repoRoot) {
    // Pre-build the key files table with an example row
    const filesTable = folderFacts.files.length > 0
        ? '| File | Role |\n|------|------|\n| `example.js` | Handles user authentication and session management |\n' +
        folderFacts.files.map(f => `| \`${f.name}\` | `).join('\n')
        : 'No source files in this folder.';

    return `You are documenting a folder in a codebase. Read the child summaries and write an accurate overview.

OUTPUT FORMAT: Start IMMEDIATELY with ## Purpose. Do not write anything before ## Purpose. No introductions. Do not output any links. Do not repeat these instructions. Stop after ## Invariants / Rules.

FOLDER: ${folderFacts.folder}/ (${folderFacts.fileCount} files, ${folderFacts.subfolderCount} subdirectories)

CHILD DOCUMENTATION SUMMARIES:
${childDocSummaries || '(none available yet)'}

## Purpose
Write 2-3 sentences explaining what this folder contains and why it exists. Mention the key responsibilities.

## Key Files
Fill in EVERY Role cell in this table. Delete the example row. Each Role should describe that file's responsibility in one phrase.
${filesTable}

## Ownership
Not yet assigned.

## Invariants / Rules
List any architectural constraints or coding conventions this folder follows. If unsure, prefix with "Likely:". Write at least one rule based on the patterns you see.

STOP HERE. Do not write anything after ## Invariants / Rules. Do not write ## Cross-References.`;
}

/**
 * Build deterministic Cross-References section for a folder doc.
 * Never generated by the LLM — always computed from folder facts.
 * Uses safe links that degrade to plain text when the target doc doesn't exist.
 */
function buildDeterministicFolderSections(folderFacts, repoRoot) {
    const currentDocPath = folderDocPath(folderFacts.folder);
    const sections = [];

    sections.push('## Cross-References');
    const refs = [];
    folderFacts.subfolders.forEach(sf => {
        const sfPath = folderFacts.folder ? `${folderFacts.folder}/${sf}` : sf;
        refs.push(`- ${safeLinkToFolder(sfPath, currentDocPath, repoRoot)}`);
    });
    folderFacts.files.forEach(f => {
        refs.push(`- ${safeLinkToFile(f.relPath, currentDocPath, repoRoot)}`);
    });
    if (refs.length > 0) {
        sections.push(...refs.slice(0, 15));
    } else {
        sections.push('No cross-references.');
    }

    return sections.join('\n');
}

// ─── Post-Processing ───────────────────────────────────────────────────────

/**
 * Clean up LLM output to fix common small-model quirks.
 * - Strip preamble lines ("Here is the generated documentation:")
 * - Remove markdown fences wrapping the entire output
 * - Remove any frontmatter the LLM might have added
 * - Fix ### headings to ##
 * - Remove fabricated URLs (github.com, http://, https://)
 * - Ensure doc starts with # heading
 */
function cleanLLMOutput(content, relPath, docType) {
    let cleaned = content;

    // Remove markdown code fences wrapping entire output
    cleaned = cleaned.replace(/^```(?:markdown|md)?\n?/gm, '').replace(/```\s*$/gm, '');

    // Remove any frontmatter the LLM added
    cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/m, '');

    // Strip preamble lines before the first ## heading
    const firstHeading = cleaned.indexOf('## ');
    if (firstHeading > 0) {
        const before = cleaned.slice(0, firstHeading).trim();
        if (!before.includes('# ')) {
            cleaned = cleaned.slice(firstHeading);
        }
    }

    // Fix ### headings to ## (common llama 3.2 quirk)
    cleaned = cleaned.replace(/^### (Purpose|Exports|Key Files|Internal Logic|Dependencies|Dependents|Side Effects|Cross-References|Ownership|Invariants|API Surface)/gm, '## $1');

    // ─── Strip leaked link sections ─────────────────────────────────────
    // LLM was told to stop before these, but small models sometimes ignore.
    // Remove any ## Dependents or ## Cross-References the LLM generated.
    cleaned = cleaned.replace(/\n## Dependents[\s\S]*?(?=\n## |$)/g, '');
    cleaned = cleaned.replace(/\n## Cross-References[\s\S]*?(?=\n## |$)/g, '');

    // Strip any remaining markdown links the LLM embedded inline
    cleaned = cleaned.replace(/\[([^\]]*)\]\(https?:\/\/github\.com[^)]*\)/g, '`$1`');
    cleaned = cleaned.replace(/\[([^\]]*)\]\(link to [^)]+\)/gi, '`$1`');
    cleaned = cleaned.replace(/\[([^\]]*)\]\(\s*\)/g, '`$1`');

    // Strip example rows from tables (left by LLM when told to "delete the example row")
    cleaned = cleaned.replace(/^\| `example`[^\n]*\n/gm, '');
    cleaned = cleaned.replace(/^\| `example\.js`[^\n]*\n/gm, '');

    // Ensure doc starts with # heading
    if (!cleaned.startsWith('# ')) {
        const heading = docType === 'folder' ? `# Folder: ${relPath}` : `# File: ${relPath}`;
        cleaned = `${heading}\n\n${cleaned}`;
    }

    // Ensure trailing newline for clean concatenation
    cleaned = cleaned.trimEnd() + '\n';

    return cleaned;
}

// ─── Core Enrichment Engine ────────────────────────────────────────────────

/**
 * Enrich a single file's documentation.
 * @param {Object} options
 * @param {string} options.filePath - Absolute path to source file.
 * @param {string} options.repoRoot - Absolute path to repo root.
 * @param {Object} options.llm - LLM instance (must have .generate()).
 * @param {boolean} options.force - Re-enrich even if unchanged.
 * @param {boolean} options.dryRun - Don't write, just report.
 * @returns {Object} { status, docPath, quality_score }
 */
async function enrichFile({ filePath, repoRoot, llm, force = false, dryRun = false }) {
    const relPath = path.relative(repoRoot, filePath);
    const docPath = path.join(repoRoot, 'docs/files', `${relPath}.md`);

    // Pass 1: Deterministic fact extraction
    const facts = extractFacts(filePath, repoRoot);

    // Fingerprint check (Workstream 4)
    if (shouldSkipFile(docPath, facts.source_hash, force)) {
        return { status: 'skipped', docPath, reason: 'unchanged', quality_score: null };
    }

    if (dryRun) {
        return { status: 'would_enrich', docPath, facts_summary: { symbols: facts.symbols.length, imports: facts.imports.length } };
    }

    // Read source (cap at 300 lines to control token usage)
    const source = fs.readFileSync(filePath, 'utf8');
    const lines = source.split('\n');
    const excerpt = lines.slice(0, 300).join('\n');

    // Pass 2: LLM enrichment
    const prompt = buildFileDocPrompt(facts, excerpt, repoRoot);
    let docContent;
    let modelUsed = 'unknown';

    try {
        const response = await llm.generate(
            'You are a code documentation writer. Read the source code carefully, then fill in every table cell and describe every function. Never output links. Never repeat instructions. Start with ## Purpose.',
            prompt,
            'cheap'
        );
        docContent = typeof response === 'string' ? response : response.text || response.content || String(response);
        modelUsed = 'cheap';
    } catch (e) {
        // Fallback: generate fact-only documentation without LLM
        docContent = generateFactOnlyDoc(facts, relPath);
        modelUsed = 'fallback_no_llm';
    }

    // Post-processing: strip LLM quirks + leaked link sections
    docContent = cleanLLMOutput(docContent, relPath, 'file');

    // Append deterministic sections (Dependents + Cross-References)
    const deterministicSections = buildDeterministicFileSections(facts, repoRoot);
    docContent = docContent + '\n' + deterministicSections + '\n';

    // Compute quality score on fully assembled doc
    const qualityScore = scoreDocContent(docContent, facts);

    // Build frontmatter
    const factsHash = crypto.createHash('sha256').update(JSON.stringify(facts)).digest('hex').slice(0, 16);
    const frontmatter = buildFrontmatter({
        source_hash: facts.source_hash,
        facts_hash: factsHash,
        generated_at: new Date().toISOString(),
        generator_version: GENERATOR_VERSION,
        model: modelUsed,
        quality_score: qualityScore.total_score,
    });

    const finalDoc = frontmatter + docContent;

    // Write
    fs.mkdirSync(path.dirname(docPath), { recursive: true });
    fs.writeFileSync(docPath, finalDoc);

    return { status: 'enriched', docPath, quality_score: qualityScore, model: modelUsed };
}

/**
 * Enrich a single folder's documentation.
 */
async function enrichFolder({ folderPath, repoRoot, llm, force = false, dryRun = false }) {
    const relPath = path.relative(repoRoot, folderPath);
    const docPath = path.join(repoRoot, 'docs/folders', relPath, 'SUMMARY.md');

    const folderFacts = extractFolderFacts(folderPath, repoRoot);

    if (dryRun) {
        return { status: 'would_enrich', docPath, facts_summary: { files: folderFacts.fileCount, subfolders: folderFacts.subfolderCount } };
    }

    // Gather child doc summaries for context
    let childSummaries = '';
    for (const file of folderFacts.files) {
        const childDocPath = path.join(repoRoot, 'docs/files', `${file.relPath}.md`);
        if (fs.existsSync(childDocPath)) {
            const content = fs.readFileSync(childDocPath, 'utf8');
            // Extract just the Purpose section
            const purposeMatch = content.match(/## Purpose\n([\s\S]*?)(?=\n##|\n---|\Z)/);
            if (purposeMatch) {
                childSummaries += `### ${file.name}\n${purposeMatch[1].trim()}\n\n`;
            }
        }
    }

    const prompt = buildFolderDocPrompt(folderFacts, childSummaries, repoRoot);
    let docContent;
    let modelUsed = 'unknown';

    try {
        const response = await llm.generate(
            'You are a code documentation writer. Read the child summaries, then fill in every table cell with specific descriptions. Never output links. Never repeat instructions. Start with ## Purpose.',
            prompt,
            'cheap'
        );
        docContent = typeof response === 'string' ? response : response.text || response.content || String(response);
        modelUsed = 'cheap';
    } catch (e) {
        docContent = generateFolderFactOnlyDoc(folderFacts, relPath);
        modelUsed = 'fallback_no_llm';
    }

    // Post-processing: strip LLM quirks + leaked link sections
    docContent = cleanLLMOutput(docContent, relPath, 'folder');

    // Append deterministic Cross-References section
    const deterministicSections = buildDeterministicFolderSections(folderFacts, repoRoot);
    docContent = docContent + '\n' + deterministicSections + '\n';

    // Compute quality score on fully assembled doc
    const qualityScore = scoreFolderDocContent(docContent, folderFacts);

    const factsHash = crypto.createHash('sha256').update(JSON.stringify(folderFacts)).digest('hex').slice(0, 16);

    const frontmatter = buildFrontmatter({
        source_hash: factsHash,
        facts_hash: factsHash,
        generated_at: new Date().toISOString(),
        generator_version: GENERATOR_VERSION,
        model: modelUsed,
        quality_score: qualityScore.total_score,
    });

    const finalDoc = frontmatter + docContent + '\n';

    fs.mkdirSync(path.dirname(docPath), { recursive: true });
    fs.writeFileSync(docPath, finalDoc);

    return { status: 'enriched', docPath, quality_score: qualityScore, model: modelUsed };
}

// ─── Fact-Only Fallback (no LLM) ──────────────────────────────────────────

function generateFactOnlyDoc(facts, relPath) {
    const lines = [`# File: ${relPath}`, ''];

    lines.push('## Purpose');
    lines.push(`Source file with ${facts.symbols.length} symbols and ${facts.lines} lines. (LLM enrichment unavailable — fact-only mode.)`, '');

    lines.push('## Exports / API Surface');
    if (facts.exports.length > 0) {
        lines.push('| Export | Type |');
        lines.push('|--------|------|');
        facts.exports.forEach(e => lines.push(`| \`${e.name}\` | ${e.type} |`));
    } else {
        lines.push('No detected exports.', '');
    }
    lines.push('');

    lines.push('## Internal Logic');
    if (facts.symbols.length > 0) {
        lines.push('Detected symbols:');
        facts.symbols.forEach(s => {
            const params = s.params ? `(${s.params.join(', ')})` : '';
            lines.push(`- \`${s.name}${params}\` (${s.type})`);
        });
    } else {
        lines.push('No functions or classes detected.');
    }
    lines.push('');

    lines.push('## Dependencies');
    if (facts.imports.length > 0) {
        lines.push('| Module | Local |');
        lines.push('|--------|-------|');
        facts.imports.forEach(i => lines.push(`| \`${i.raw}\` | ${i.isLocal ? 'Yes' : 'No'} |`));
    } else {
        lines.push('No imports detected.');
    }
    lines.push('');

    lines.push('## Dependents');
    if (facts.dependents.length > 0) {
        facts.dependents.forEach(d => lines.push(`- [${path.basename(d)}](../../files/${d}.md)`));
    } else {
        lines.push('No dependents detected.');
    }
    lines.push('');

    lines.push('## Side Effects');
    if (facts.sideEffects.length > 0) {
        facts.sideEffects.forEach(e => lines.push(`- ${e}`));
    } else {
        lines.push('No side effects detected.');
    }
    lines.push('');

    lines.push('## Cross-References');
    const localImports = facts.imports.filter(i => i.isLocal && i.resolved);
    if (localImports.length > 0) {
        localImports.forEach(i => {
            lines.push(`- See [${path.basename(i.raw)}](../${i.resolved}.md)`);
        });
    } else {
        lines.push('No cross-references.');
    }

    return lines.join('\n');
}

function generateFolderFactOnlyDoc(facts, relPath) {
    const lines = [`# Folder: ${relPath}`, ''];

    lines.push('## Purpose');
    lines.push(`Contains ${facts.fileCount} source files and ${facts.subfolderCount} subdirectories. (LLM enrichment unavailable — fact-only mode.)`, '');

    lines.push('## Key Files');
    if (facts.files.length > 0) {
        lines.push('| File | Size |');
        lines.push('|------|------|');
        facts.files.forEach(f => lines.push(`| \`${f.name}\` | ${f.size}B |`));
    }
    lines.push('');

    lines.push('## Ownership');
    lines.push('Not yet assigned.', '');

    lines.push('## Invariants / Rules');
    lines.push('Not yet documented.', '');

    lines.push('## Cross-References');
    if (facts.subfolders.length > 0) {
        facts.subfolders.forEach(sf => lines.push(`- [${sf}/](../${relPath}/${sf}/SUMMARY.md)`));
    } else {
        lines.push('No cross-references.');
    }

    return lines.join('\n');
}

// ─── Quality Scoring (Workstream 3 support) ────────────────────────────────

const REQUIRED_FILE_HEADINGS = ['## Purpose', '## Exports / API Surface', '## Dependencies', '## Side Effects', '## Cross-References'];
const REQUIRED_FOLDER_HEADINGS = ['## Purpose', '## Key Files', '## Ownership', '## Cross-References'];

function scoreDocContent(content, facts) {
    const scores = {
        structure_score: 0,
        factuality_score: 0,
        specificity_score: 0,
        crossref_score: 0,
        total_score: 0,
    };

    // Structure: are required headings present?
    const headingsPresent = REQUIRED_FILE_HEADINGS.filter(h => content.includes(h)).length;
    scores.structure_score = Math.round((headingsPresent / REQUIRED_FILE_HEADINGS.length) * 100);

    // Factuality: do extracted facts appear in the doc?
    let factMatches = 0;
    let factTotal = 0;

    facts.symbols.slice(0, 10).forEach(s => {
        factTotal++;
        if (content.includes(s.name)) factMatches++;
    });
    facts.imports.slice(0, 10).forEach(i => {
        factTotal++;
        if (content.includes(i.raw) || content.includes(path.basename(i.raw))) factMatches++;
    });
    facts.exports.slice(0, 5).forEach(e => {
        factTotal++;
        if (content.includes(e.name)) factMatches++;
    });

    scores.factuality_score = factTotal > 0 ? Math.round((factMatches / factTotal) * 100) : 100;

    // Specificity: content length, no placeholders
    const meaningfulLength = content.replace(/^---[\s\S]*?---\n/, '').replace(/\s+/g, ' ').trim().length;
    const hasPlaceholders = /\[What does this file do\?\]|\[List functions\/classes export\]|\[Describe|<!-- PLACEHOLDER -->/.test(content);

    if (hasPlaceholders) {
        scores.specificity_score = 0;
    } else if (meaningfulLength > 1000) {
        scores.specificity_score = 100;
    } else if (meaningfulLength > 500) {
        scores.specificity_score = 75;
    } else if (meaningfulLength > 300) {
        scores.specificity_score = 50;
    } else {
        scores.specificity_score = 25;
    }

    // Cross-references: does the doc link to other docs?
    const linkCount = (content.match(/\[.+?\]\(.+?\.md\)/g) || []).length;
    if (linkCount >= 3) scores.crossref_score = 100;
    else if (linkCount >= 1) scores.crossref_score = 60;
    else scores.crossref_score = 0;

    scores.total_score = Math.round(
        (scores.structure_score * 0.25) +
        (scores.factuality_score * 0.35) +
        (scores.specificity_score * 0.25) +
        (scores.crossref_score * 0.15)
    );

    return scores;
}

function scoreFolderDocContent(content, facts) {
    const scores = {
        structure_score: 0,
        factuality_score: 0,
        specificity_score: 0,
        crossref_score: 0,
        total_score: 0,
    };

    const headingsPresent = REQUIRED_FOLDER_HEADINGS.filter(h => content.includes(h)).length;
    scores.structure_score = Math.round((headingsPresent / REQUIRED_FOLDER_HEADINGS.length) * 100);

    let factMatches = 0;
    let factTotal = 0;
    facts.files.forEach(f => {
        factTotal++;
        if (content.includes(f.name)) factMatches++;
    });
    scores.factuality_score = factTotal > 0 ? Math.round((factMatches / factTotal) * 100) : 100;

    const meaningfulLength = content.replace(/^---[\s\S]*?---\n/, '').replace(/\s+/g, ' ').trim().length;
    const hasPlaceholders = /\[Describe what this folder|<!-- PLACEHOLDER -->/.test(content);
    if (hasPlaceholders) scores.specificity_score = 0;
    else if (meaningfulLength > 500) scores.specificity_score = 100;
    else if (meaningfulLength > 250) scores.specificity_score = 75;
    else scores.specificity_score = 50;

    const linkCount = (content.match(/\[.+?\]\(.+?\.md\)/g) || []).length;
    if (linkCount >= 2) scores.crossref_score = 100;
    else if (linkCount >= 1) scores.crossref_score = 60;
    else scores.crossref_score = 0;

    scores.total_score = Math.round(
        (scores.structure_score * 0.3) +
        (scores.factuality_score * 0.3) +
        (scores.specificity_score * 0.25) +
        (scores.crossref_score * 0.15)
    );

    return scores;
}

// ─── Batch Orchestrator ────────────────────────────────────────────────────

/**
 * Enrich all docs in a repo.
 * @param {Object} options
 * @param {string} options.repoRoot
 * @param {Object} options.llm
 * @param {boolean} options.dryRun
 * @param {boolean} options.force
 * @param {boolean} options.onlyMissing
 * @param {number} options.maxConcurrency
 * @param {string} options.singleFile - Enrich only this file (relative path).
 * @param {string} options.singleFolder - Enrich only this folder (relative path).
 * @param {boolean} options.changedOnly - Only enrich changed files (git diff).
 */
async function enrichAll(options = {}) {
    const {
        repoRoot,
        llm,
        dryRun = false,
        force = false,
        onlyMissing = false,
        maxConcurrency = 2,
        singleFile = null,
        singleFolder = null,
        changedOnly = false,
    } = options;

    const results = {
        enriched: 0,
        skipped: 0,
        failed: 0,
        low_confidence: [],
        errors: [],
        details: [],
    };

    // Determine which files to process
    let filesToProcess = [];
    let foldersToProcess = [];

    if (singleFile) {
        const absPath = path.isAbsolute(singleFile) ? singleFile : path.join(repoRoot, singleFile);
        filesToProcess.push(absPath);
    } else if (singleFolder) {
        const absPath = path.isAbsolute(singleFolder) ? singleFolder : path.join(repoRoot, singleFolder);
        foldersToProcess.push(absPath);
    } else {
        // Scan repo
        const { files, folders } = scanRepo(repoRoot, changedOnly);
        filesToProcess = files;
        foldersToProcess = folders;
    }

    // Filter for only-missing
    if (onlyMissing && !singleFile && !singleFolder) {
        filesToProcess = filesToProcess.filter(f => {
            const rel = path.relative(repoRoot, f);
            const docPath = path.join(repoRoot, 'docs/files', `${rel}.md`);
            if (!fs.existsSync(docPath)) return true;
            const content = fs.readFileSync(docPath, 'utf8');
            return isPlaceholderDoc(content);
        });
        foldersToProcess = foldersToProcess.filter(f => {
            const rel = path.relative(repoRoot, f);
            const docPath = path.join(repoRoot, 'docs/folders', rel, 'SUMMARY.md');
            if (!fs.existsSync(docPath)) return true;
            const content = fs.readFileSync(docPath, 'utf8');
            return isPlaceholderDoc(content);
        });
    }

    console.log(`[DOC-ENRICHER] Processing ${filesToProcess.length} files, ${foldersToProcess.length} folders (concurrency: ${maxConcurrency})`);

    // Process files in batches
    for (let i = 0; i < filesToProcess.length; i += maxConcurrency) {
        const batch = filesToProcess.slice(i, i + maxConcurrency);
        const promises = batch.map(async (filePath) => {
            try {
                const result = await enrichFile({ filePath, repoRoot, llm, force, dryRun });
                results.details.push(result);

                if (result.status === 'enriched') {
                    results.enriched++;
                    const rel = path.relative(repoRoot, filePath);
                    console.log(`  ✅ ${rel}`);
                    if (result.quality_score && result.quality_score.total_score < 50) {
                        results.low_confidence.push({ file: rel, score: result.quality_score.total_score });
                    }
                } else if (result.status === 'skipped') {
                    results.skipped++;
                } else if (result.status === 'would_enrich') {
                    const rel = path.relative(repoRoot, filePath);
                    console.log(`  🔍 Would enrich: ${rel}`);
                }
            } catch (e) {
                results.failed++;
                results.errors.push({ file: path.relative(repoRoot, filePath), error: e.message });
                console.error(`  ❌ ${path.relative(repoRoot, filePath)}: ${e.message}`);
            }
        });
        await Promise.all(promises);
    }

    // Process folders (sequentially — they depend on file docs)
    for (const folderPath of foldersToProcess) {
        try {
            const result = await enrichFolder({ folderPath, repoRoot, llm, force, dryRun });
            results.details.push(result);

            if (result.status === 'enriched') {
                results.enriched++;
                const rel = path.relative(repoRoot, folderPath);
                console.log(`  📁 ${rel}/SUMMARY.md`);
            } else if (result.status === 'would_enrich') {
                const rel = path.relative(repoRoot, folderPath);
                console.log(`  🔍 Would enrich folder: ${rel}`);
            }
        } catch (e) {
            results.failed++;
            results.errors.push({ folder: path.relative(repoRoot, folderPath), error: e.message });
        }
    }

    console.log(`\n[DOC-ENRICHER] Done. Enriched: ${results.enriched} | Skipped: ${results.skipped} | Failed: ${results.failed}`);
    if (results.low_confidence.length > 0) {
        console.log(`[DOC-ENRICHER] ⚠️ Low quality docs (${results.low_confidence.length}):`);
        results.low_confidence.forEach(lc => console.log(`  - ${lc.file} (score: ${lc.score})`));
    }

    return results;
}

// ─── Repo Scanner ──────────────────────────────────────────────────────────

function scanRepo(repoRoot, changedOnly = false) {
    const files = [];
    const folders = [];

    if (changedOnly) {
        // Get changed files from git
        try {
            const output = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD', {
                cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
            });
            const changedFiles = output.split('\n').filter(Boolean);
            for (const rel of changedFiles) {
                const abs = path.join(repoRoot, rel);
                const ext = path.extname(rel);
                if (TARGET_EXTS.includes(ext) && fs.existsSync(abs) && !rel.startsWith('docs')) {
                    files.push(abs);
                    const dir = path.dirname(abs);
                    if (!folders.includes(dir) && dir !== repoRoot) {
                        folders.push(dir);
                    }
                }
            }
            return { files, folders };
        } catch (_) {
            // Fall through to full scan
        }
    }

    // Full scan
    function scan(dir) {
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch (_) {
            return;
        }

        let hasChildren = false;

        for (const entry of entries) {
            if (IGNORE_DIRS.includes(entry.name)) continue;

            const fullPath = path.join(dir, entry.name);
            const relPath = path.relative(repoRoot, fullPath);

            if (relPath.startsWith('docs')) continue;

            if (entry.isDirectory()) {
                scan(fullPath);
                hasChildren = true;
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (TARGET_EXTS.includes(ext) && !entry.name.endsWith('.min.js') && !entry.name.endsWith('lock.json') && entry.name !== 'ONBOARDING.json') {
                    files.push(fullPath);
                    hasChildren = true;
                }
            }
        }

        if (hasChildren && dir !== repoRoot) {
            folders.push(dir);
        }
    }

    scan(repoRoot);
    return { files, folders };
}

// ─── Placeholder Detection ─────────────────────────────────────────────────

const PLACEHOLDER_MARKERS = [
    '<!-- PLACEHOLDER -->',
    '[What does this file do?]',
    '[List functions/classes export]',
    '[E.g., modifies DB, writes files, sets globals]',
    '[Describe what this folder contains and its role]',
    '[List modules this folder interacts with]',
    '[Short description of the project]',
    '[Describe current architecture stability]',
    '[Describe current deploy/runtime stability]',
];

function isPlaceholderDoc(content) {
    for (const marker of PLACEHOLDER_MARKERS) {
        if (content.includes(marker)) return true;
    }
    return false;
}

module.exports = {
    enrichFile,
    enrichFolder,
    enrichAll,
    scoreDocContent,
    scoreFolderDocContent,
    isPlaceholderDoc,
    redactSecrets,
    parseFrontmatter,
    buildFrontmatter,
    PLACEHOLDER_MARKERS,
    REQUIRED_FILE_HEADINGS,
    REQUIRED_FOLDER_HEADINGS,
    GENERATOR_VERSION,
};
