const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getOnboardingStatus, IGNORE_DIRS, TARGET_EXTS } = require('./status');

const REPO_ROOT = path.resolve(__dirname, '../../');

function log(msg, dryRun) {
    console.log(`[ONBOARDING${dryRun ? '::DRY-RUN' : ''}] ${msg}`);
}

function generateTemplates(dryRun, onlyMissing) {
    const templates = [
        {
            file: 'docs/INDEX.md',
            content: `# Project Index\n\n**Repo:** \n**Owner:** \n**Purpose:** [Short description of the project]\n\n## Quick Links\n- [Architecture](architecture/overview.md)\n- [Operations](operations/how-to-run.md)\n`
        },
        {
            file: 'docs/tree.md',
            content: `# Repository Tree Map\n\nAuto-generated representation of the high-level project structure.\n\n\`\`\`\n[Run 'tree -L 2' to update this section]\n\`\`\`\n`
        },
        {
            file: 'docs/dependencies.md',
            content: `# Dependency Map\n\n## Runtime Dependencies\n- Node / PM2 / etc.\n\n## External Services\n- Databases (SQLite/Postgres)\n- LLM Providers\n\n## Critical Internal Modules\n- \`lib/db.js\` -> Core database interactions\n- \`index.js\` -> API and orchestration\n`
        },
        {
            file: 'docs/runbook.md',
            content: `# Runbook\n\n## Setup\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Local Run\n\`\`\`bash\nnode bin/setu start\n\`\`\`\n\n## Testing\n\`\`\`bash\nnpm test\n\`\`\`\n\n## Troubleshooting\n- Check \`setu.log\` for process errors.\n`
        },
        {
            file: 'docs/current-state.md',
            content: `# Current State\n\n**Last Updated:** ${new Date().toISOString().split('T')[0]}\n\n## Architectural State\n- [Describe current architecture stability]\n\n## Operational State\n- [Describe current deploy/runtime stability]\n`
        }
    ];

    for (const t of templates) {
        const fullPath = path.join(REPO_ROOT, t.file);
        const exists = fs.existsSync(fullPath);

        if (exists && onlyMissing) {
            log(`Skipping existing core artifact: ${t.file}`, dryRun);
            continue;
        }

        log(`${exists ? 'Updating' : 'Creating'} core artifact: ${t.file}`, dryRun);
        if (!dryRun) {
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, t.content);
        }
    }
}

function scanAndGenerateFiles(dir, dryRun, onlyMissing) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (IGNORE_DIRS.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(REPO_ROOT, fullPath);

        // Skip anything in the docs directory directly
        if (relPath.startsWith('docs')) continue;

        if (entry.isDirectory()) {
            // Create folder summary
            const summaryFile = path.join(REPO_ROOT, 'docs/folders', relPath, 'SUMMARY.md');
            const summaryExists = fs.existsSync(summaryFile);

            if (!(summaryExists && onlyMissing)) {
                log(`${summaryExists ? 'Updating' : 'Creating'} folder summary: docs/folders/${relPath}/SUMMARY.md`, dryRun);
                if (!dryRun) {
                    fs.mkdirSync(path.dirname(summaryFile), { recursive: true });
                    fs.writeFileSync(summaryFile, `# Folder Summary: ${relPath}\n\n**Purpose:** [Describe what this folder contains and its role]\n\n**Key Interactions:**\n- [List modules this folder interacts with]\n`);
                }
            }

            scanAndGenerateFiles(fullPath, dryRun, onlyMissing);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);

            // Filter target extensions
            if (!TARGET_EXTS.includes(ext) || entry.name.endsWith('.min.js') || entry.name.endsWith('lock.json') || entry.name === 'ONBOARDING.json') continue;

            const docFile = path.join(REPO_ROOT, 'docs/files', `${relPath}.md`);
            const docExists = fs.existsSync(docFile);

            if (!(docExists && onlyMissing)) {
                log(`${docExists ? 'Updating' : 'Creating'} file doc: docs/files/${relPath}.md`, dryRun);
                if (!dryRun) {
                    fs.mkdirSync(path.dirname(docFile), { recursive: true });
                    fs.writeFileSync(docFile, `# File: ${relPath}\n\n**Purpose:** [What does this file do?]\n\n**Key Exports/Entrypoints:**\n- [List functions/classes export]\n\n**Side Effects:**\n- [E.g., modifies DB, writes files, sets globals]\n`);
                }
            }
        }
    }
}

function writeOnboardingJson(dryRun) {
    log('Computing completeness and writing ONBOARDING.json...', dryRun);

    if (dryRun) {
        log('Would calculate status via validator and write ONBOARDING.json with head_commit.', dryRun);
        return;
    }

    const manifestPath = path.join(REPO_ROOT, 'ONBOARDING.json');

    // Create a base if it doesn't exist
    let currentManifest = {};
    if (fs.existsSync(manifestPath)) {
        try {
            currentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        } catch (e) { }
    }

    let currentHead = '';
    try {
        currentHead = execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
    } catch (e) { }

    // We write an incomplete manifest first so the validator has it to check staleness
    const baseManifest = {
        repo: currentManifest.repo || path.basename(REPO_ROOT),
        default_branch: 'master',
        head_commit: currentHead,
        generated_at: new Date().toISOString(),
        completeness_percent: 0,
        owners_modules: currentManifest.owners_modules || {},
        checks: currentManifest.checks || {}
    };

    fs.writeFileSync(manifestPath, JSON.stringify(baseManifest, null, 2));

    // Now query the status
    // The status validator recalculates actual physical files dynamically 
    const stat = getOnboardingStatus();

    // Force the exact validation result directly back on disk.
    baseManifest.completeness_percent = stat.completeness;
    baseManifest.checks = stat.checks; // { core_artifacts, file_doc_coverage, folder_summary_coverage, stale_commit_check }

    fs.writeFileSync(manifestPath, JSON.stringify(baseManifest, null, 2));

    log(`ONBOARDING.json written. Calculated completeness: ${stat.completeness}%`, dryRun);
}

function runGenerator(options = {}) {
    const dryRun = !!options.dryRun;
    const onlyMissing = !!options.onlyMissing;

    log(`Starting Onboarding Generation... (dryRun: ${dryRun}, onlyMissing: ${onlyMissing})`, dryRun);

    // 1. Generate Core Templates
    generateTemplates(dryRun, onlyMissing);

    // 2. Scan Repo mapping (Files & Folders)
    scanAndGenerateFiles(REPO_ROOT, dryRun, onlyMissing);

    // 3. Status Validation & Manifest Update
    writeOnboardingJson(dryRun);

    log('✅ Generation sequence complete.', dryRun);
}

module.exports = {
    runGenerator
};
