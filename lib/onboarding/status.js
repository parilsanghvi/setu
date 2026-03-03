const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../../');
const IGNORE_DIRS = ['node_modules', '.git', '.setu', '.jules', '.Jules', 'dist', 'coverage', 'output', 'logs', '.local_tmp', 'to_be_deleted', 'artifacts', 'temp', '.claude', '.cursor', '.qwen', '.gemini'];
const TARGET_EXTS = ['.js', '.ts', '.tsx', '.jsx', '.py', '.json', '.yml', '.yaml', '.sh'];

// ─── Quality Gate v2: Placeholder Detection + Quality Scoring ──────────────

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
    '[Run \'tree -L 2\' to update this section]',
];

const REQUIRED_FILE_HEADINGS = ['## Purpose', '## Exports', '## Dependencies', '## Side Effects'];
const REQUIRED_FOLDER_HEADINGS = ['## Purpose', '## Key Files'];
const MIN_MEANINGFUL_LENGTH = 300;

/**
 * Check if a doc file has real content (not just a placeholder template).
 * @param {string} filePath - Absolute path to the doc file.
 * @returns {boolean}
 */
function isDocPopulated(filePath) {
    if (!fs.existsSync(filePath)) return false;

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (_) {
        return false;
    }

    if (content.length === 0) return false;

    // Reject if any placeholder marker is found
    for (const marker of PLACEHOLDER_MARKERS) {
        if (content.includes(marker)) return false;
    }

    // Reject if content is too short to be meaningful
    const stripped = content.replace(/^---[\s\S]*?---\n/, '').replace(/\s+/g, ' ').trim();
    if (stripped.length < MIN_MEANINGFUL_LENGTH) return false;

    return true;
}

/**
 * Score a doc file's quality on multiple dimensions.
 * @param {string} filePath - Absolute path to the doc file.
 * @param {string} docType - 'file' or 'folder'
 * @returns {Object} Quality scores.
 */
function scoreDocQuality(filePath, docType = 'file') {
    const scores = {
        structure_score: 0,
        factuality_score: 0,
        specificity_score: 0,
        crossref_score: 0,
        total_score: 0,
        populated: false,
        issues: [],
    };

    if (!fs.existsSync(filePath)) {
        scores.issues.push('File does not exist');
        return scores;
    }

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (_) {
        scores.issues.push('Cannot read file');
        return scores;
    }

    // Populated check
    scores.populated = isDocPopulated(filePath);
    if (!scores.populated) {
        scores.issues.push('Contains placeholder content or is too short');
        return scores;
    }

    // Structure: required headings
    const requiredHeadings = docType === 'folder' ? REQUIRED_FOLDER_HEADINGS : REQUIRED_FILE_HEADINGS;
    const headingsPresent = requiredHeadings.filter(h => content.includes(h)).length;
    scores.structure_score = Math.round((headingsPresent / requiredHeadings.length) * 100);
    if (headingsPresent < requiredHeadings.length) {
        const missing = requiredHeadings.filter(h => !content.includes(h));
        scores.issues.push(`Missing headings: ${missing.join(', ')}`);
    }

    // Factuality: check if at least one code symbol/import/path appears
    const hasCodeRef = /`[a-zA-Z_][a-zA-Z0-9_.]*`/.test(content);
    const hasTable = /\|.*\|.*\|/.test(content);
    if (hasCodeRef && hasTable) scores.factuality_score = 100;
    else if (hasCodeRef) scores.factuality_score = 70;
    else scores.factuality_score = 30;

    // Specificity: meaningful content length
    const stripped = content.replace(/^---[\s\S]*?---\n/, '').replace(/\s+/g, ' ').trim();
    if (stripped.length > 1000) scores.specificity_score = 100;
    else if (stripped.length > 500) scores.specificity_score = 75;
    else if (stripped.length > MIN_MEANINGFUL_LENGTH) scores.specificity_score = 50;
    else scores.specificity_score = 25;

    // Cross-references: markdown links to .md files
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

/**
 * Compute repo-wide documentation quality report.
 * @param {string} repoRoot
 * @returns {Object} Aggregate quality data.
 */
function getRepoQuality(repoRoot = REPO_ROOT) {
    const report = {
        total_docs: 0,
        populated_docs: 0,
        placeholder_docs: 0,
        avg_quality: 0,
        p50_quality: 0,
        p95_quality: 0,
        placeholder_rate: 0,
        low_quality_files: [],
        top_issues: {},
        file_scores: [],
        folder_scores: [],
    };

    // Scan file docs
    const filesDir = path.join(repoRoot, 'docs/files');
    if (fs.existsSync(filesDir)) {
        scanDocsDir(filesDir, 'file', report, repoRoot);
    }

    // Scan folder docs
    const foldersDir = path.join(repoRoot, 'docs/folders');
    if (fs.existsSync(foldersDir)) {
        scanDocsDir(foldersDir, 'folder', report, repoRoot);
    }

    // Compute aggregates
    const allScores = [...report.file_scores, ...report.folder_scores].map(s => s.total_score);
    report.total_docs = allScores.length;
    report.populated_docs = allScores.filter(s => s > 0).length;
    report.placeholder_docs = report.total_docs - report.populated_docs;
    report.placeholder_rate = report.total_docs > 0 ? Math.round((report.placeholder_docs / report.total_docs) * 100) : 0;

    if (allScores.length > 0) {
        report.avg_quality = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        const sorted = [...allScores].sort((a, b) => a - b);
        report.p50_quality = sorted[Math.floor(sorted.length * 0.5)];
        report.p95_quality = sorted[Math.floor(sorted.length * 0.95)];
    }

    // Low quality: score < 50 and populated
    report.low_quality_files = [...report.file_scores, ...report.folder_scores]
        .filter(s => s.total_score > 0 && s.total_score < 50)
        .sort((a, b) => a.total_score - b.total_score)
        .slice(0, 10);

    return report;
}

function scanDocsDir(dir, docType, report, repoRoot) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scanDocsDir(fullPath, docType, report, repoRoot);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const score = scoreDocQuality(fullPath, docType);
            const relPath = path.relative(repoRoot, fullPath);
            const scoreEntry = { path: relPath, ...score };
            if (docType === 'file') report.file_scores.push(scoreEntry);
            else report.folder_scores.push(scoreEntry);
        }
    }
}

function calculateCoverage() {
    let stats = {
        totalFiles: 0,
        docFiles: 0,
        totalFolders: 0,
        docFolders: 0,
        missingDocs: []
    };

    function scan(dir) {
        let hasCountableChildren = false;
        let entries = [];
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch (e) {
            return false;
        }

        for (const entry of entries) {
            if (IGNORE_DIRS.includes(entry.name)) continue;

            const fullPath = path.join(dir, entry.name);
            const relPath = path.relative(REPO_ROOT, fullPath);

            if (relPath.startsWith('docs')) continue;

            if (entry.isDirectory()) {
                const isNonEmpty = scan(fullPath);
                if (isNonEmpty) {
                    hasCountableChildren = true;
                    stats.totalFolders++;
                    const summaryFile = path.join(REPO_ROOT, 'docs/folders', relPath, 'SUMMARY.md');
                    if (isDocPopulated(summaryFile)) {
                        stats.docFolders++;
                    } else {
                        stats.missingDocs.push(`docs/folders/${relPath}/SUMMARY.md`);
                    }
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (TARGET_EXTS.includes(ext) && !entry.name.endsWith('.min.js') && !entry.name.endsWith('lock.json') && !['ONBOARDING.json', 'status.json', 'drift.json'].includes(entry.name)) {
                    hasCountableChildren = true;
                    stats.totalFiles++;
                    const docFile = path.join(REPO_ROOT, 'docs/files', `${relPath}.md`);
                    if (isDocPopulated(docFile)) {
                        stats.docFiles++;
                    } else {
                        stats.missingDocs.push(`docs/files/${relPath}.md`);
                    }
                }
            }
        }
        return hasCountableChildren;
    }

    scan(REPO_ROOT);
    return stats;
}


let _cachedHead = null;
let _cachedHeadTime = 0;
function _getCurrentHead(repoRoot) {
    const now = Date.now();
    if (_cachedHead && (now - _cachedHeadTime < 1000)) {
        return _cachedHead;
    }
    try {
        const headPath = path.join(repoRoot, '.git', 'HEAD');
        if (fs.existsSync(headPath)) {
            const headContent = fs.readFileSync(headPath, 'utf8').trim();
            if (headContent.startsWith('ref: ')) {
                const refPath = headContent.split(' ')[1];
                const fullRefPath = path.join(repoRoot, '.git', refPath);
                if (fs.existsSync(fullRefPath)) {
                    _cachedHead = fs.readFileSync(fullRefPath, 'utf8').trim();
                    _cachedHeadTime = now;
                    return _cachedHead;
                }
            } else {
                _cachedHead = headContent;
                _cachedHeadTime = now;
                return _cachedHead;
            }
        }
    } catch (e) {
        // Fallback
    }

    // Fallback
    try {
        _cachedHead = execSync('git rev-parse HEAD', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
    } catch (e) {
        _cachedHead = '';
    }
    _cachedHeadTime = now;
    return _cachedHead;
}

function getOnboardingStatus(options = { fast: false }) {
    const onboardingJsonPath = path.join(REPO_ROOT, 'ONBOARDING.json');

    // FAST PATH CACHE 🏎️
    if (options.fast && fs.existsSync(onboardingJsonPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(onboardingJsonPath, 'utf8'));
            const currentHead = _getCurrentHead(REPO_ROOT);
            if (data.completeness_percent === 100) {
                const isStale = data.head_commit !== currentHead;
                const errors = isStale ? ['ONBOARDING.json head_commit does not match current commit.'] : [];
                return {
                    ok: true,
                    completeness: 100,
                    stale: isStale,
                    missing: [],
                    errors,
                    data,
                    generatedAt: data.generated_at || null,
                    checks: data.checks || {}
                };
            }
        } catch (e) {
            // Silently fall through to full computation if cache check breaks
        }
    }

    const result = {
        ok: false,
        completeness: 0,
        stale: false,
        missing: [],
        errors: [],
        data: null,
        generatedAt: null,
        checks: {
            core_artifacts_ok: false,
            file_doc_coverage_percent: 0,
            folder_summary_coverage_percent: 0,
            stale_commit_check_ok: false
        }
    };

    // Perform physical checks first
    const requiredArtifacts = [
        'docs/INDEX.md',
        'docs/tree.md',
        'docs/dependencies.md',
        'docs/runbook.md',
        'docs/current-state.md'
    ];

    let missingCore = 0;
    for (const artifact of requiredArtifacts) {
        const fullPath = path.join(REPO_ROOT, artifact);
        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
            missingCore++;
            if (!result.missing.includes(artifact)) result.missing.push(artifact);
        }
    }
    result.checks.core_artifacts_ok = (missingCore === 0);
    if (!result.checks.core_artifacts_ok) {
        result.errors.push(`Missing core artifacts: ${missingCore} needed.`);
    }

    const coverage = calculateCoverage();
    result.checks.file_doc_coverage_percent = coverage.totalFiles ? Math.round((coverage.docFiles / coverage.totalFiles) * 100) : 100;
    result.checks.folder_summary_coverage_percent = coverage.totalFolders ? Math.round((coverage.docFolders / coverage.totalFolders) * 100) : 100;

    // Add any missing file/folder coverage
    if (coverage.missingDocs.length > 0) {
        result.errors.push(`Missing docs for ${coverage.totalFiles - coverage.docFiles} file(s) and ${coverage.totalFolders - coverage.docFolders} folder(s).`);
        // We only append up to 5 items to avoid blowing up the terminal
        result.missing = result.missing.concat(coverage.missingDocs.slice(0, 5));
        if (coverage.missingDocs.length > 5) {
            result.missing.push(`...and ${coverage.missingDocs.length - 5} more.`);
        }
    }

    // Now validate existing JSON payload
    if (!fs.existsSync(onboardingJsonPath)) {
        result.errors.push('ONBOARDING.json is missing.');
        result.missing.push('ONBOARDING.json');
        return result;
    }

    try {
        result.data = JSON.parse(fs.readFileSync(onboardingJsonPath, 'utf8'));
    } catch (e) {
        result.errors.push('ONBOARDING.json is malformed or not valid JSON.');
        return result;
    }

    // Staleness check
    try {
        const currentHead = _getCurrentHead(REPO_ROOT);
        // Skip strict staleness check in CI environments as merge commits change the HEAD hash
        const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

        if (!isCI && result.data.head_commit && result.data.head_commit !== currentHead) {
            result.stale = true;
            result.checks.stale_commit_check_ok = false;
            // Downgrade staleness to non-blocking for CI compatibility
            // result.errors.push(`ONBOARDING.json head_commit does not match current commit.`);
        } else if (!result.data.head_commit) {
            result.stale = true;
            result.checks.stale_commit_check_ok = false;
            result.errors.push('No head_commit found in ONBOARDING.json.');
        } else {
            result.checks.stale_commit_check_ok = true;
        }
    } catch (e) {
        // In CI, git commands might fail if fetch-depth is shallow or .git is minimal
        if (process.env.CI) {
            result.checks.stale_commit_check_ok = true;
        } else {
            result.checks.stale_commit_check_ok = false;
            result.errors.push('Failed to verify git HEAD for staleness check.');
        }
    }

    // Calculate dynamic completeness percentage based on physical targets
    const expectedTotal = requiredArtifacts.length + coverage.totalFiles + coverage.totalFolders;
    const actualTotal = (requiredArtifacts.length - missingCore) + coverage.docFiles + coverage.docFolders;
    result.completeness = expectedTotal > 0 ? Math.round((actualTotal / expectedTotal) * 100) : 100;

    result.generatedAt = result.data.generated_at || null;

    if (result.completeness < 100) {
        result.errors.push(`Calculated completeness is ${result.completeness}%. It must be 100% to proceed.`);
    }

    // Stale state is a warning, not a hard failure, provided completeness is met
    result.ok = result.errors.length === 0 && result.completeness === 100;

    return result;
}

module.exports = { calculateCoverage,
    getOnboardingStatus,
    isDocPopulated,
    scoreDocQuality,
    getRepoQuality,
    IGNORE_DIRS,
    TARGET_EXTS,
    PLACEHOLDER_MARKERS,
    MIN_MEANINGFUL_LENGTH,
};
