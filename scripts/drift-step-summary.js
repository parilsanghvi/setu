const fs = require('fs');
const path = require('path');

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (!summaryPath) {
    console.error('GITHUB_STEP_SUMMARY not set.');
    process.exit(1);
}

const driftJsonPath = path.resolve(process.cwd(), 'drift.json');
if (!fs.existsSync(driftJsonPath)) {
    fs.appendFileSync(summaryPath, '🛑 **Error: drift.json not found**\n');
    process.exit(1);
}

let result;
try {
    result = JSON.parse(fs.readFileSync(driftJsonPath, 'utf8'));
} catch (e) {
    fs.appendFileSync(summaryPath, '🛑 **Error: Failed to parse drift.json**\n');
    process.exit(1);
}

let markdown = '### Docs Drift Report 📝\n\n';

if (result.ok) {
    markdown += '✅ **No Drift Detected**\n\n';
    markdown += `- Checked changed files: **${result.changed_files.length}**\n`;
} else {
    markdown += `🛑 **Docs Drift Detected: ${result.drift_percent}%**\n\n`;
    markdown += `- Changed Files: **${result.changed_files.length}**\n`;
    markdown += `- Required Docs: **${result.required_docs.length}**\n`;
    markdown += `- Missing Docs: **${result.missing_docs.length}**\n\n`;

    markdown += '#### Top Missing Paths\n\n';
    const missing = result.missing_docs.slice(0, 10);
    missing.forEach(p => {
        markdown += `- \`${p}\`\n`;
    });
    if (result.missing_docs.length > 10) {
        markdown += `- ...and ${result.missing_docs.length - 10} more.\n`;
    }

    markdown += '\n#### Context & Reviewers\n\n';
    markdown += `- Base Ref: **${result.base_ref_used}**\n`;
    markdown += `- Source: **${result.changed_files_source}**\n`;
    if (result.strict_diff_warning) {
        if (result.strict_diff_failed) {
            markdown += `- 🛑 **STRICT DIFF FAILED**: ${result.strict_diff_warning}\n`;
        } else {
            markdown += `- ⚠️ **STRICT DIFF WARNING**: ${result.strict_diff_warning}\n`;
        }
    }
    markdown += `- Ignored Files: **${result.ignored_files ? result.ignored_files.length : 0}**\n`;

    if (result.ownership) {
        const owners = result.ownership.by_owner ? Object.keys(result.ownership.by_owner) : [];
        let sourceLabel = result.ownership.ownership_source === 'onboarding' ? 'ONBOARDING' :
            (result.ownership.ownership_source === 'codeowners' ? 'CODEOWNERS fallback' : 'None');

        if (owners.length > 0) {
            markdown += `- Suggested Reviewers (${sourceLabel}): **${owners.map(o => `@${o}`).join(', ')}**\n`;
        }
        if (result.ownership.unowned_files && result.ownership.unowned_files.length > 0) {
            markdown += `- ⚠️ **Warning**: ${result.ownership.unowned_files.length} changed files have no designated module owner.\n`;
        }

        if (result.ownership_sla && result.ownership_sla.mode !== 'off') {
            markdown += `\n#### Ownership SLA (${result.ownership_sla.mode})\n`;
            if (result.ownership_sla.unowned_blocking) {
                markdown += `🛑 **SLA FAILED**: ${result.ownership_sla.blocking_files.length} unowned files matched \`require_owner_for_paths\` policies.\n`;
                result.ownership_sla.blocking_files.forEach(f => {
                    markdown += `- 🚫 \`${f}\`\n`;
                });
            } else if ((result.ownership_sla.blocking_files && result.ownership_sla.blocking_files.length > 0)) {
                markdown += `⚠️ **SLA WARNING**: ${result.ownership_sla.blocking_files.length} unowned files matched \`require_owner_for_paths\` policies but enforcement is off.\n`;
            } else {
                markdown += `✅ SLA Compliant.\n`;
            }
        }
    }

    if (!result.strict_diff_failed) {
        markdown += '\n#### How to Fix\n';
        markdown += 'Run the following locally:\n';
        markdown += '```bash\nsetu onboarding run --only-missing\n```\n';
        markdown += 'Then verify with:\n';
        markdown += '```bash\nsetu onboarding doctor --diff --strict-diff\n```\n';
    }
}

fs.appendFileSync(summaryPath, markdown);

const reportDir = path.resolve(process.cwd(), 'artifacts');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.resolve(reportDir, 'drift-report.md');
fs.writeFileSync(reportPath, '<!-- setu-governance-report -->\n' + markdown);

if (!result.ok) {
    process.exit(1);
}
