const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { IGNORE_DIRS, TARGET_EXTS } = require('./status');

const { resolveChangedFiles } = require('./changed-files');
const { parseCodeowners, matchCodeowners } = require('./codeowners');
const { getSetuPath, REPO_ROOT } = require('./paths');

function getBaseRefUsed(optionsBaseline) {
    if (optionsBaseline) return optionsBaseline;
    if (process.env.SETU_DRIFT_BASE) return process.env.SETU_DRIFT_BASE;
    try {
        const onboardingPath = path.join(REPO_ROOT, 'ONBOARDING.json');
        if (fs.existsSync(onboardingPath)) {
            const data = JSON.parse(fs.readFileSync(onboardingPath, 'utf8'));
            if (data.default_branch) {
                return `origin/${data.default_branch}`;
            }
        }
    } catch (e) { }
    return 'origin/main';
}

function getIgnoreConfig() {
    const ignorePath = getSetuPath('drift-ignore.json');
    if (fs.existsSync(ignorePath)) {
        try {
            return JSON.parse(fs.readFileSync(ignorePath, 'utf8'));
        } catch (e) { }
    }
    return {
        paths: ["contracts.json", "merge_summary.json", "logs/**", "output/**", "temp/**"],
        extensions: [".lock"],
        globs: ["**/*.min.js"]
    };
}

// Simple glob to regex converter for standard ignores
function globToRegex(globStr) {
    return new RegExp('^' + globStr.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\./g, '\\.') + '$');
}

function isTargetFile(filePath, ignoreConfig) {
    // 1) Apply explicitly ignored extensions
    if (ignoreConfig.extensions) {
        const ext = path.extname(filePath);
        if (ignoreConfig.extensions.includes(ext)) return { target: false, ignored: true };
    }

    // 2) Apply glob/path ignores
    if (ignoreConfig.paths) {
        for (const p of ignoreConfig.paths) {
            if (globToRegex(p).test(filePath)) return { target: false, ignored: true };
        }
    }
    if (ignoreConfig.globs) {
        for (const g of ignoreConfig.globs) {
            // simple match, if it handles **/*.min.js
            if (globToRegex(g).test(filePath)) return { target: false, ignored: true };
        }
    }

    // Standard structural ignores
    const parts = filePath.split(path.sep);
    if (parts.some(part => IGNORE_DIRS.includes(part))) return { target: false, ignored: false };
    if (parts[0] === 'docs') return { target: false, ignored: false };

    const ext = path.extname(filePath);
    if (!TARGET_EXTS.includes(ext)) return { target: false, ignored: false };

    const basename = path.basename(filePath);
    if (basename.endsWith('.min.js') || basename === 'package-lock.json' || basename === 'ONBOARDING.json') return { target: false, ignored: false };

    return { target: true, ignored: false };
}

function getOwnershipMap() {
    let source = 'none';
    let map = {};
    let codeownersRules = [];

    try {
        const onboardingPath = path.join(REPO_ROOT, 'ONBOARDING.json');
        if (fs.existsSync(onboardingPath)) {
            const data = JSON.parse(fs.readFileSync(onboardingPath, 'utf8'));
            if (data.owners_modules && Object.keys(data.owners_modules).length > 0) {
                return { map: data.owners_modules, source: 'onboarding', codeownersRules };
            }
        }
    } catch (e) { }

    // Fallback: Parse .github/CODEOWNERS or CODEOWNERS
    const codeownersPaths = [
        path.join(REPO_ROOT, '.github', 'CODEOWNERS'),
        path.join(REPO_ROOT, 'CODEOWNERS')
    ];
    for (const cp of codeownersPaths) {
        if (fs.existsSync(cp)) {
            codeownersRules = parseCodeowners(cp);
            if (codeownersRules.length > 0) source = 'codeowners';
            break;
        }
    }

    return { map, source, codeownersRules };
}

function computeDrift(options = {}) {
    const baseRef = getBaseRefUsed(options.base);
    const { files: changedFiles, source: changed_files_source, count: changed_files_count } = resolveChangedFiles(baseRef, REPO_ROOT);

    // Strict diff check
    const isStrict = options.strict;
    // Context check: are we in a PR?
    // We assume if GITHUB_EVENT_PATH exists and contains pull_request, we are in a PR.
    let inPRContext = false;
    if (process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
        try {
            const eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
            if (eventData.pull_request) inPRContext = true;
        } catch (e) { }
    }

    let strictDiffWarning = null;
    let strictDiffFailed = false;

    if (changed_files_count === 0 && inPRContext) {
        strictDiffWarning = `Suspicious 0-file diff detected returning from source: ${changed_files_source}. Ensure fetch-depth is set or GITHUB_TOKEN is available.`;
        if (isStrict) {
            strictDiffFailed = true;
        }
    }

    const ignoreConfig = getIgnoreConfig();
    const { map: ownersModules, source: ownershipSource, codeownersRules } = getOwnershipMap();

    const sourceChanged = [];
    const ignoredFiles = [];

    for (const f of changedFiles) {
        const res = isTargetFile(f, ignoreConfig);
        if (res.ignored) {
            ignoredFiles.push(f);
        } else if (res.target) {
            sourceChanged.push(f);
        }
    }

    const requiredDocs = new Set();
    const existingDocs = new Set();
    const missingDocs = new Set();

    const ownership = {
        ownership_source: ownershipSource,
        owners_from_codeowners_count: ownershipSource === 'codeowners' ? new Set(codeownersRules.flatMap(r => r.owners)).size : 0,
        owners_from_onboarding_count: ownershipSource === 'onboarding' ? Object.keys(ownersModules).length : 0,
        ownership_source_by_file: {},
        by_owner: {},
        unowned_files: [],
        codeowners_rule_hits: 0,
        codeowners_unmatched_files: 0,
        ownership_resolution_trace: {}
    };

    const ownershipSla = {
        mode: 'off',
        unowned_blocking: false,
        blocking_files: []
    };

    let policyConfig = { mode: 'off', require_owner_for_paths: [] };
    try {
        const policyPath = getSetuPath('ownership-policy.json');
        if (fs.existsSync(policyPath)) {
            policyConfig = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
            ownershipSla.mode = policyConfig.mode || 'off';
        }
    } catch (e) { }

    for (const relPath of sourceChanged) {
        // Map ownership
        let ownedBy = [];
        let ruleTrace = 'none';

        if (ownershipSource === 'onboarding') {
            for (const [owner, modulePaths] of Object.entries(ownersModules)) {
                if (Array.isArray(modulePaths)) {
                    if (modulePaths.some(p => relPath.startsWith(p) || (p.startsWith('*') && relPath.endsWith(p.replace('*', ''))))) {
                        ownedBy.push(owner);
                        if (!ownership.by_owner[owner]) ownership.by_owner[owner] = [];
                        if (!ownership.by_owner[owner].includes(relPath)) ownership.by_owner[owner].push(relPath);
                    }
                }
            }
            if (ownedBy.length > 0) ruleTrace = 'onboarding_json';
        } else if (ownershipSource === 'codeowners') {
            const match = matchCodeowners(codeownersRules, relPath);
            if (match) {
                ownedBy = match.owners;
                ownership.codeowners_rule_hits++;
                ruleTrace = `codeowners_line_${match.lineNumber} (${match.pattern})`;

                ownedBy.forEach(owner => {
                    if (!ownership.by_owner[owner]) ownership.by_owner[owner] = [];
                    if (!ownership.by_owner[owner].includes(relPath)) ownership.by_owner[owner].push(relPath);
                });
            } else {
                ownership.codeowners_unmatched_files++;
            }
        }

        ownership.ownership_resolution_trace[relPath] = { source: ownershipSource, owners: ownedBy, rule: ruleTrace };

        if (ownedBy.length > 0) {
            ownership.ownership_source_by_file[relPath] = ownedBy;
        } else {
            ownership.unowned_files.push(relPath);
            if (policyConfig.mode !== 'off' && policyConfig.require_owner_for_paths) {
                for (const pg of policyConfig.require_owner_for_paths) {
                    if (globToRegex(pg).test(relPath) || relPath.startsWith(pg.replace(/\/\*\*$/, '/'))) {
                        ownershipSla.blocking_files.push(relPath);
                        break;
                    }
                }
            }
        }

        // Map required docs
        const expectedDocPaths = [];
        expectedDocPaths.push(`docs/files/${relPath}.md`);
        let currentFolder = path.dirname(relPath);
        while (currentFolder && currentFolder !== '.') {
            expectedDocPaths.push(`docs/folders/${currentFolder}/SUMMARY.md`);
            currentFolder = path.dirname(currentFolder);
        }

        for (const p of expectedDocPaths) {
            requiredDocs.add(p);
            const fullP = path.join(REPO_ROOT, p);
            if (fs.existsSync(fullP)) existingDocs.add(p);
            else missingDocs.add(p);
        }
    }

    if (ownershipSla.blocking_files.length > 0 && ownershipSla.mode === 'enforce') {
        ownershipSla.unowned_blocking = true;
    }

    const { getActiveProfile } = require('./governance-profiles');
    const profile = getActiveProfile();

    // Auto-enforce strict diff passing flags from config if unset by ENV/CLI parameter implicitly
    const effectiveStrictDiff = Boolean(strictDiffFailed || (profile.config.strict_diff && process.env.CI && changed_files_count === 0 && process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)));
    const effectiveIsOk = missingDocs.size === 0 && !effectiveStrictDiff && !ownershipSla.unowned_blocking;

    const driftPercent = requiredDocs.size === 0 ? 0 : Math.round((missingDocs.size / requiredDocs.size) * 100);

    const result = {
        base_ref_used: baseRef,
        changed_files_source,
        changed_files_count,
        changed_files: changedFiles,
        ignored_files: ignoredFiles,
        required_docs: Array.from(requiredDocs),
        existing_docs: Array.from(existingDocs),
        missing_docs: Array.from(missingDocs),
        ownership,
        ownership_sla: ownershipSla,
        drift_percent: driftPercent,
        strict_diff_warning: effectiveStrictDiff ? 'Strict diff enabled via preset/flag. 0 diffs suspicious.' : null,
        strict_diff_failed: effectiveStrictDiff,
        ok: effectiveIsOk
    };

    // Telemetry log append
    try {
        const logPath = getSetuPath('drift-history.jsonl');
        const maxRecords = parseInt(process.env.SETU_DRIFT_HISTORY_MAX) || profile.config.telemetry_max || 500;
        const maxDays = parseInt(process.env.SETU_DRIFT_HISTORY_DAYS) || profile.config.telemetry_days || 30;

        let existingLines = [];
        if (fs.existsSync(logPath)) {
            existingLines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
        }

        const now = new Date();
        const cutoffTime = now.getTime() - (maxDays * 24 * 60 * 60 * 1000);

        let validRecords = existingLines.map(l => {
            try { return JSON.parse(l); } catch (e) { return null; }
        }).filter(r => {
            if (!r || !r.timestamp) return false;
            return new Date(r.timestamp).getTime() > cutoffTime;
        });

        const newRecord = {
            timestamp: now.toISOString(),
            ok: result.ok,
            drift_percent: result.drift_percent,
            changed_files_count: result.changed_files_count,
            missing_docs_count: missingDocs.size,
            source: changed_files_source,
            base_ref_used: result.base_ref_used,
            missing_docs: result.missing_docs,
            ownership: {
                unowned_files: ownership.unowned_files,
                unowned_count: ownership.unowned_files.length,
                ownership_source: ownership.ownership_source
            }
        };

        validRecords.push(newRecord);

        // Enforce max records limit explicitly
        if (validRecords.length > maxRecords) {
            validRecords = validRecords.slice(-maxRecords);
        }

        const finalOutput = validRecords.map(r => JSON.stringify(r)).join('\n') + '\n';

        if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.writeFileSync(logPath, finalOutput);
    } catch (e) { }

    return result;
}

module.exports = {
    computeDrift
};
