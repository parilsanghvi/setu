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

function checkPRContext(changed_files_count, changed_files_source, isStrict) {
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

    return { inPRContext, strictDiffWarning, strictDiffFailed };
}

function filterChangedFiles(changedFiles, ignoreConfig) {
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
    return { sourceChanged, ignoredFiles };
}

function mapOwnershipAndDocs(sourceChanged, ownershipSource, ownersModules, codeownersRules) {
    const requiredDocs = new Set();
    const existingDocs = new Set();
    const missingDocs = new Set();
    const ownership = {
        owned_files: [],
        unowned_files: [],
        ownership_source: ownershipSource,
        owners_impacted: new Set()
    };
    const ownershipSla = {
        unowned_blocking: false,
        warnings: []
    };

    const path = require('path');
    const { isDocPopulated } = require('./status');
    const { REPO_ROOT } = require('./paths');

    for (const f of sourceChanged) {
        // If the file itself was deleted, we don't require documentation for it
        if (!fs.existsSync(path.join(REPO_ROOT, f))) continue;

        requiredDocs.add(f);

        // Ownership Check
        let isOwned = false;
        if (ownershipSource === 'codeowners') {
            const match = matchCodeowners(codeownersRules, f);
            if (match) {
                isOwned = true;
                match.owners.forEach(o => ownership.owners_impacted.add(o));
            }
        } else if (ownershipSource === 'onboarding') {
            for (const [modulePattern, modData] of Object.entries(ownersModules)) {
                if (globToRegex(modulePattern).test(f)) {
                    isOwned = true;
                    if (modData.owners) modData.owners.forEach(o => ownership.owners_impacted.add(o));
                }
            }
        }

        if (isOwned) {
            ownership.owned_files.push(f);
        } else {
            ownership.unowned_files.push(f);
            ownershipSla.warnings.push(`File ${f} has no registered owner.`);
        }

        // Documentation Check
        const docPath = path.join(REPO_ROOT, 'docs/files', f + '.md');
        if (isDocPopulated(docPath)) {
            existingDocs.add(docPath);
        } else {
            missingDocs.add(docPath);
        }
    }

    ownership.owners_impacted = Array.from(ownership.owners_impacted);
    return { requiredDocs, existingDocs, missingDocs, ownership, ownershipSla };
}

function appendTelemetry(result, missingDocsSize, ownership, profile, changed_files_source) {
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
            missing_docs_count: missingDocsSize,
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

        if (validRecords.length > maxRecords) {
            validRecords = validRecords.slice(-maxRecords);
        }

        const finalOutput = validRecords.map(r => JSON.stringify(r)).join('\n') + '\n';

        if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.writeFileSync(logPath, finalOutput);
    } catch (e) { }
}

function computeDrift(options = {}) {
    const baseRef = getBaseRefUsed(options.base);
    const { files: changedFiles, source: changed_files_source, count: changed_files_count } = resolveChangedFiles(baseRef, REPO_ROOT);

    const isStrict = options.strict;
    const { inPRContext, strictDiffWarning, strictDiffFailed } = checkPRContext(changed_files_count, changed_files_source, isStrict);

    const ignoreConfig = getIgnoreConfig();
    const { map: ownersModules, source: ownershipSource, codeownersRules } = getOwnershipMap();

    const { sourceChanged, ignoredFiles } = filterChangedFiles(changedFiles, ignoreConfig);

    const { requiredDocs, existingDocs, missingDocs, ownership, ownershipSla } = mapOwnershipAndDocs(sourceChanged, ownershipSource, ownersModules, codeownersRules);

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
    appendTelemetry(result, missingDocs.size, ownership, profile, changed_files_source);

    return result;
}

module.exports = {
    computeDrift
};
