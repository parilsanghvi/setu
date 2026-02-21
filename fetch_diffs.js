const { execSync } = require('child_process');
const fs = require('fs');

const prsJson = execSync('gh pr list --json number,title --limit 50', { encoding: 'utf8' });
const prs = JSON.parse(prsJson);

let out = '';
for (const pr of prs) {
    out += `\n\n======================================================\n`;
    out += `PR #${pr.number}: ${pr.title}\n`;
    out += `======================================================\n`;
    try {
        const diff = execSync(`gh pr diff ${pr.number}`, { encoding: 'utf8' });
        out += diff;
    } catch (e) {
        out += 'Error fetching diff\n';
    }
}
fs.writeFileSync('all_diffs.txt', out);
