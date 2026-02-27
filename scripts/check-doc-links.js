#!/usr/bin/env node
/**
 * check-doc-links.js — Scan all docs and validate internal markdown links.
 *
 * Usage:
 *   node scripts/check-doc-links.js [--json] [--fix]
 *
 * Exit 0 if all links valid, exit 1 if broken links found.
 */

const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '..');
const { validateAllLinks } = require('../lib/onboarding/doc-links');

const args = process.argv.slice(2);
const isJson = args.includes('--json');
const isFix = args.includes('--fix');

const report = validateAllLinks(repoRoot);

if (isFix) {
    // Auto-fix: strip github.com URLs and empty links
    const fixReport = { fixed: 0, files_touched: 0 };
    const docsDir = path.join(repoRoot, 'docs');

    function fixDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                fixDir(full);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                let content = fs.readFileSync(full, 'utf8');
                let changed = false;

                // Replace github.com blob URLs with empty parens
                const githubRe = /\[([^\]]*)\]\(https?:\/\/github\.com[^)]*\)/g;
                if (githubRe.test(content)) {
                    content = content.replace(githubRe, '`$1`');
                    changed = true;
                    fixReport.fixed++;
                }

                // Replace (link to ... documentation) with plain text
                const linkToRe = /\[([^\]]*)\]\(link to [^)]+\)/gi;
                if (linkToRe.test(content)) {
                    content = content.replace(linkToRe, '`$1`');
                    changed = true;
                    fixReport.fixed++;
                }

                // Replace empty link targets [text]()
                const emptyRe = /\[([^\]]*)\]\(\s*\)/g;
                if (emptyRe.test(content)) {
                    content = content.replace(emptyRe, '`$1`');
                    changed = true;
                    fixReport.fixed++;
                }

                if (changed) {
                    fs.writeFileSync(full, content);
                    fixReport.files_touched++;
                }
            }
        }
    }

    fixDir(docsDir);

    if (isJson) {
        console.log(JSON.stringify(fixReport, null, 2));
    } else {
        console.log(`[DOC-LINKS] Fixed ${fixReport.fixed} bad link patterns in ${fixReport.files_touched} files.`);
    }
    process.exit(0);
}

if (isJson) {
    // Compact output for CI
    const summary = {
        ok: report.ok,
        total_files: report.total_files,
        total_links: report.total_links,
        valid_links: report.valid_links,
        broken_links: report.broken_links,
        github_blob_links: report.github_blob_links,
        empty_links: report.empty_links,
        files_with_issues: report.files_with_broken.length,
        top_broken_patterns: report.top_broken_patterns,
        broken_details: report.broken_details.slice(0, 20),
    };
    console.log(JSON.stringify(summary, null, 2));
} else {
    console.log('\n🔗 Documentation Link Validation Report');
    console.log(`   Total files scanned: ${report.total_files}`);
    console.log(`   Total internal links: ${report.total_links}`);
    console.log(`   ✅ Valid links:       ${report.valid_links}`);
    console.log(`   ❌ Broken links:      ${report.broken_links}`);
    console.log(`   🔗 GitHub blob URLs:  ${report.github_blob_links}`);
    console.log(`   ⚪ Empty links:       ${report.empty_links}`);

    if (report.files_with_broken.length > 0) {
        console.log(`\n   📄 Files with issues (${report.files_with_broken.length}):`);
        report.files_with_broken.slice(0, 15).forEach(f => {
            const parts = [];
            if (f.broken > 0) parts.push(`${f.broken} broken`);
            if (f.github_blob > 0) parts.push(`${f.github_blob} github`);
            if (f.empty > 0) parts.push(`${f.empty} empty`);
            console.log(`   - ${f.file} (${parts.join(', ')})`);
        });
    }

    if (report.broken_details.length > 0) {
        console.log(`\n   🔍 Sample broken links (first 10):`);
        report.broken_details.slice(0, 10).forEach(d => {
            console.log(`   - ${d.file}:${d.line} [${d.label}](${d.href}) — ${d.reason}`);
        });
    }

    if (report.ok) {
        console.log('\n   ✅ All internal links are valid!');
    } else {
        console.log('\n   🔧 TO FIX:');
        console.log('   Run: node scripts/check-doc-links.js --fix');
        console.log('   Then: setu onboarding enrich --force');
    }
}

process.exit(report.ok ? 0 : 1);
