/**
 * doc-links.js — Canonical Link Resolver for Setu Documentation
 *
 * Converts source paths to canonical doc paths and generates correct
 * relative links between doc files. Deterministic, no LLM involvement.
 *
 * Rules:
 *   file doc:      docs/files/<relative-source-path>.md
 *   folder summary: docs/folders/<relative-folder>/SUMMARY.md
 *
 * All links are relative from the current doc's directory to the target doc.
 */

const fs = require('fs');
const path = require('path');

// ─── Canonical Path Generators ──────────────────────────────────────────────

/**
 * Get the canonical doc path for a source file.
 * @param {string} sourceRelPath - Relative path of the source file from repo root (e.g. "lib/db.js")
 * @returns {string} Doc path relative to repo root (e.g. "docs/files/lib/db.js.md")
 */
function fileDocPath(sourceRelPath) {
    const normalized = sourceRelPath.replace(/\\/g, '/');
    return `docs/files/${normalized}.md`;
}

/**
 * Get the canonical doc path for a folder summary.
 * @param {string} folderRelPath - Relative path of the folder from repo root (e.g. "lib/auth")
 * @returns {string} Doc path relative to repo root (e.g. "docs/folders/lib/auth/SUMMARY.md")
 */
function folderDocPath(folderRelPath) {
    const normalized = folderRelPath.replace(/\\/g, '/');
    return `docs/folders/${normalized}/SUMMARY.md`;
}

// ─── Relative Link Generator ────────────────────────────────────────────────

/**
 * Generate a correct relative link from one doc file to another.
 * @param {string} fromDocPath - Doc path of the current file (relative to repo root)
 * @param {string} toDocPath - Doc path of the target file (relative to repo root)
 * @returns {string} Relative path from `from` to `to` (e.g. "../../files/lib/db.js.md")
 */
function relativeLink(fromDocPath, toDocPath) {
    const fromDir = path.dirname(fromDocPath);
    const toNormalized = toDocPath.replace(/\\/g, '/');
    const fromNormalized = fromDir.replace(/\\/g, '/');

    let rel = path.relative(fromNormalized, toNormalized).replace(/\\/g, '/');

    // Ensure it starts with ./ or ../ for clarity
    if (!rel.startsWith('.') && !rel.startsWith('/')) {
        rel = './' + rel;
    }

    return rel;
}

/**
 * Generate a markdown link to a file doc from the current doc location.
 * @param {string} sourceRelPath - Relative source file path (e.g. "lib/db.js")
 * @param {string} currentDocPath - Doc path of the file we're writing links in
 * @param {string} label - Optional custom label; defaults to basename
 * @returns {string} Markdown link like `[db.js](../../files/lib/db.js.md)`
 */
function fileLink(sourceRelPath, currentDocPath, label) {
    const target = fileDocPath(sourceRelPath);
    const rel = relativeLink(currentDocPath, target);
    const displayLabel = label || path.basename(sourceRelPath);
    return `[${displayLabel}](${rel})`;
}

/**
 * Generate a markdown link to a folder summary from the current doc location.
 * @param {string} folderRelPath - Relative folder path (e.g. "lib/auth")
 * @param {string} currentDocPath - Doc path of the file we're writing links in
 * @param {string} label - Optional custom label
 * @returns {string} Markdown link like `[auth/](../../../folders/lib/auth/SUMMARY.md)`
 */
function folderLink(folderRelPath, currentDocPath, label) {
    const target = folderDocPath(folderRelPath);
    const rel = relativeLink(currentDocPath, target);
    const displayLabel = label || path.basename(folderRelPath) + '/';
    return `[${displayLabel}](${rel})`;
}

// ─── Link Validation ────────────────────────────────────────────────────────

/**
 * Check if a doc target exists on disk.
 * @param {string} docPath - Doc path relative to repo root
 * @param {string} repoRoot - Absolute path to repo root
 * @returns {boolean}
 */
function docExists(docPath, repoRoot) {
    return fs.existsSync(path.join(repoRoot, docPath));
}

/**
 * Generate a link only if the target doc exists, otherwise emit plain text.
 * @param {string} sourceRelPath - Source file path
 * @param {string} currentDocPath - Current doc path
 * @param {string} repoRoot - Repo root
 * @param {string} label - Optional label
 * @returns {string} Either a markdown link or plain text
 */
function safeLinkToFile(sourceRelPath, currentDocPath, repoRoot, label) {
    const target = fileDocPath(sourceRelPath);
    if (docExists(target, repoRoot)) {
        return fileLink(sourceRelPath, currentDocPath, label);
    }
    return `\`${label || path.basename(sourceRelPath)}\` _(doc not yet generated)_`;
}

/**
 * Safe link to a folder summary.
 */
function safeLinkToFolder(folderRelPath, currentDocPath, repoRoot, label) {
    const target = folderDocPath(folderRelPath);
    if (docExists(target, repoRoot)) {
        return folderLink(folderRelPath, currentDocPath, label);
    }
    return `\`${label || path.basename(folderRelPath) + '/'}\` _(summary not yet generated)_`;
}

// ─── Bulk Link Extraction & Validation ──────────────────────────────────────

const MARKDOWN_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const GITHUB_BLOB_RE = /https?:\/\/github\.com\/[^)]+/;

/**
 * Extract all markdown links from content.
 * @param {string} content - Markdown content
 * @returns {Array<{label: string, href: string, line: number}>}
 */
function extractLinks(content) {
    const links = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        let match;
        MARKDOWN_LINK_RE.lastIndex = 0;
        while ((match = MARKDOWN_LINK_RE.exec(lines[i])) !== null) {
            links.push({
                label: match[1],
                href: match[2],
                line: i + 1,
            });
        }
    }

    return links;
}

/**
 * Validate all internal links in a doc file.
 * @param {string} docAbsPath - Absolute path to the doc file
 * @param {string} repoRoot - Absolute path to repo root
 * @returns {Object} { total, valid, broken, github_blob, details }
 */
function validateDocLinks(docAbsPath, repoRoot) {
    const content = fs.readFileSync(docAbsPath, 'utf8');
    const docRelPath = path.relative(repoRoot, docAbsPath);
    const docDir = path.dirname(docAbsPath);
    const links = extractLinks(content);

    const result = {
        file: docRelPath,
        total: 0,
        valid: 0,
        broken: 0,
        github_blob: 0,
        external: 0,
        empty: 0,
        details: [],
    };

    for (const link of links) {
        // Skip external URLs (http/https that aren't github blob)
        if (/^https?:\/\//.test(link.href)) {
            if (GITHUB_BLOB_RE.test(link.href)) {
                result.total++;
                result.github_blob++;
                result.details.push({
                    ...link,
                    status: 'github_blob',
                    reason: 'Internal doc should use relative links, not GitHub URLs',
                });
            } else {
                result.external++;
            }
            continue;
        }

        // Skip anchors
        if (link.href.startsWith('#')) continue;

        // Skip empty links
        if (!link.href || link.href === '()' || link.href.trim() === '') {
            result.total++;
            result.empty++;
            result.details.push({
                ...link,
                status: 'empty',
                reason: 'Empty or placeholder link target',
            });
            continue;
        }

        result.total++;

        // Resolve the relative link to an absolute path
        const targetAbs = path.resolve(docDir, link.href.split('#')[0]); // strip anchors
        if (fs.existsSync(targetAbs)) {
            result.valid++;
        } else {
            result.broken++;
            result.details.push({
                ...link,
                status: 'broken',
                reason: `Target does not exist: ${path.relative(repoRoot, targetAbs)}`,
            });
        }
    }

    return result;
}

/**
 * Validate all doc links across the entire docs/ directory.
 * @param {string} repoRoot
 * @returns {Object} Aggregate report.
 */
function validateAllLinks(repoRoot) {
    const report = {
        total_files: 0,
        total_links: 0,
        valid_links: 0,
        broken_links: 0,
        github_blob_links: 0,
        empty_links: 0,
        files_with_broken: [],
        broken_details: [],
        top_broken_patterns: {},
        ok: true,
    };

    const docsDir = path.join(repoRoot, 'docs');
    if (!fs.existsSync(docsDir)) return report;

    function scan(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scan(full);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                report.total_files++;
                const result = validateDocLinks(full, repoRoot);
                report.total_links += result.total;
                report.valid_links += result.valid;
                report.broken_links += result.broken;
                report.github_blob_links += result.github_blob;
                report.empty_links += result.empty;

                if (result.broken > 0 || result.github_blob > 0 || result.empty > 0) {
                    report.files_with_broken.push({
                        file: result.file,
                        broken: result.broken,
                        github_blob: result.github_blob,
                        empty: result.empty,
                    });
                    result.details.forEach(d => {
                        report.broken_details.push({ file: result.file, ...d });
                        // Track patterns
                        const pattern = d.status;
                        report.top_broken_patterns[pattern] = (report.top_broken_patterns[pattern] || 0) + 1;
                    });
                }
            }
        }
    }

    scan(docsDir);

    report.ok = report.broken_links === 0 && report.github_blob_links === 0 && report.empty_links === 0;
    return report;
}

module.exports = {
    fileDocPath,
    folderDocPath,
    relativeLink,
    fileLink,
    folderLink,
    docExists,
    safeLinkToFile,
    safeLinkToFolder,
    extractLinks,
    validateDocLinks,
    validateAllLinks,
};
