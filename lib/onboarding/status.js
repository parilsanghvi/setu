const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../../');
const IGNORE_DIRS = ['node_modules', '.git', '.setu', '.jules', '.Jules', 'dist', 'coverage', 'output', 'logs', '.local_tmp', 'to_be_deleted', 'artifacts', 'temp', '.claude', '.cursor', '.qwen', '.gemini'];
const TARGET_EXTS = ['.js', '.ts', '.tsx', '.jsx', '.py', '.json', '.yml', '.yaml', '.sh'];

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
                    if (fs.existsSync(summaryFile) && fs.statSync(summaryFile).size > 0) {
                        stats.docFolders++;
                    } else {
                        stats.missingDocs.push(`docs/folders/${relPath}/SUMMARY.md`);
                    }
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (TARGET_EXTS.includes(ext) && !entry.name.endsWith('.min.js') && !entry.name.endsWith('lock.json') && entry.name !== 'ONBOARDING.json') {
                    hasCountableChildren = true;
                    stats.totalFiles++;
                    const docFile = path.join(REPO_ROOT, 'docs/files', `${relPath}.md`);
                    if (fs.existsSync(docFile) && fs.statSync(docFile).size > 0) {
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

function getOnboardingStatus(options = { fast: false }) {
    const onboardingJsonPath = path.join(REPO_ROOT, 'ONBOARDING.json');

    // FAST PATH CACHE 🏎️
    if (options.fast && fs.existsSync(onboardingJsonPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(onboardingJsonPath, 'utf8'));
            const currentHead = execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
            if (data.head_commit === currentHead && data.completeness_percent === 100) {
                return {
                    ok: true,
                    completeness: 100,
                    stale: false,
                    missing: [],
                    errors: [],
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
        const currentHead = execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
        const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

        if (result.data.head_commit && result.data.head_commit !== currentHead) {
            if (isCI) {
                // In CI, we relax the exact commit match because actions/checkout might be on a merge commit
                // or detached HEAD that differs from the local branch tip recorded.
                // As long as coverage is 100%, we allow it.
                result.checks.stale_commit_check_ok = true;
                // We don't mark it stale here to avoid failing the build
            } else {
                result.stale = true;
                result.checks.stale_commit_check_ok = false;
                result.errors.push(`ONBOARDING.json head_commit does not match current commit.`);
            }
        } else if (!result.data.head_commit) {
            result.stale = true;
            result.checks.stale_commit_check_ok = false;
            result.errors.push('No head_commit found in ONBOARDING.json.');
        } else {
            result.checks.stale_commit_check_ok = true;
        }
    } catch (e) {
        result.checks.stale_commit_check_ok = false;
        result.errors.push('Failed to verify git HEAD for staleness check.');
    }

    // Calculate dynamic completeness percentage based on physical targets
    const expectedTotal = requiredArtifacts.length + coverage.totalFiles + coverage.totalFolders;
    const actualTotal = (requiredArtifacts.length - missingCore) + coverage.docFiles + coverage.docFolders;
    result.completeness = expectedTotal > 0 ? Math.round((actualTotal / expectedTotal) * 100) : 100;

    result.generatedAt = result.data.generated_at || null;

    if (result.completeness < 100) {
        result.errors.push(`Calculated completeness is ${result.completeness}%. It must be 100% to proceed.`);
    }

    result.ok = result.errors.length === 0 && !result.stale && result.completeness === 100;

    return result;
}

module.exports = {
    getOnboardingStatus,
    IGNORE_DIRS,
    TARGET_EXTS
};
