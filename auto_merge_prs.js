const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
    try {
        console.log(`Executing: ${cmd}`);
        return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
    } catch (err) {
        console.error(`Command failed: ${cmd}\n${err.stdout}\n${err.stderr}`);
        throw err;
    }
}

function runTest() {
    try {
        console.log(`Running tests...`);
        execSync('node tests/runner.js', {
            stdio: 'inherit',
            encoding: 'utf8',
            env: { ...process.env, DASHBOARD_PASS: 'secret', LOG_LEVEL: 'error' }
        });
        return true;
    } catch (err) {
        console.error(`Tests failed!`);
        return false;
    }
}

async function main() {
    try {
        const prsJson = run('gh pr list --json number,title,headRefName --limit 100');
        const prs = JSON.parse(prsJson);

        console.log(`Found ${prs.length} open PRs.`);

        const failedPRs = [];
        const mergedPRs = [];

        for (const pr of prs) {
            console.log(`\n\n--- Processing PR #${pr.number}: ${pr.title} ---`);
            try {
                // Ensure we are on master and up to date
                run('git checkout master');
                try { run('git pull'); } catch (e) { console.log('git pull failed, continuing...'); }

                // Checkout PR
                run(`gh pr checkout ${pr.number}`);

                // Merge master into PR to bring in test fixes
                try { run('git merge master -m "Merge master testing fixes"'); } catch (e) { console.log('merge master failed', e); }

                // npm install if needed
                try { run('npm install'); } catch (e) { }

                // Run tests
                const passed = runTest();

                if (passed) {
                    console.log(`✅ Tests passed for PR #${pr.number}. Merging...`);
                    // Merge via gh
                    run(`gh pr merge ${pr.number} --merge --delete-branch`);
                    mergedPRs.push(pr.number);
                } else {
                    console.log(`❌ Tests failed for PR #${pr.number}. Skipping...`);
                    failedPRs.push({ number: pr.number, title: pr.title });
                }
            } catch (err) {
                console.log(`⚠️ Error processing PR #${pr.number}. Skipping...`);
                failedPRs.push({ number: pr.number, title: pr.title });
            } finally {
                // Attempt to recover checkout master
                try {
                    run('git checkout master');
                } catch (e) { }
            }
        }

        console.log('\n\n=== SUMMARY ===');
        console.log(`Merged ${mergedPRs.length} PRs: ${mergedPRs.join(', ')}`);
        console.log(`Failed/Skipped ${failedPRs.length} PRs:`);
        failedPRs.forEach(p => console.log(` - #${p.number}: ${p.title}`));

        fs.writeFileSync('merge_summary.json', JSON.stringify({ merged: mergedPRs, failed: failedPRs }, null, 2));

    } catch (err) {
        console.error('Fatal error:', err);
    }
}

main();
