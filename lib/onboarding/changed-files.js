const fs = require('fs');
const { execFileSync } = require('child_process');

function getGitHubApiChanges() {
    // Check if we are in a GitHub Actions PR run
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (eventPath && fs.existsSync(eventPath)) {
        try {
            const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
            if (eventData.pull_request) {
                // If the PR is relatively small, or if we have token access, we can fetch the files
                // Actually, doing this via curl requires the token, which typically we have via GITHUB_TOKEN.
                // But GITHUB_TOKEN isn't always automatically loaded into env unless strictly passed.
                // Another easier method is using the event payload if it has commits (push only).
                // Let's implement the standard GitHub API call using curl if a token is present, 
                // OR we just parse standard GH CLI if it's installed.

                const repo = process.env.GITHUB_REPOSITORY;
                const prNumber = eventData.pull_request.number;
                const token = process.env.GITHUB_TOKEN;

                if (repo && prNumber && token) {
                    const output = execFileSync(
                        'curl',
                        [
                            '-s',
                            '-H', `Authorization: token ${token}`,
                            '-H', 'Accept: application/vnd.github.v3+json',
                            `https://api.github.com/repos/${repo}/pulls/${prNumber}/files`
                        ],
                        { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }
                    );
                    const filesData = JSON.parse(output);
                    if (Array.isArray(filesData)) {
                        return {
                            files: filesData.map(f => f.filename),
                            source: 'github_api',
                            count: filesData.length
                        };
                    }
                }
            }
        } catch (e) {
            // Silently fall through to git diff
        }
    }
    return null;
}

function resolveChangedFiles(baseRef, repoRoot) {
    // 1. Try GitHub API
    const apiResult = getGitHubApiChanges();
    if (apiResult) {
        return apiResult;
    }

    // 2. Try standard local git diff
    try {
        const output = execFileSync('git', ['diff', '--name-only', `${baseRef}...HEAD`], { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
        const files = output.split('\n').filter(Boolean);
        return { files, source: 'git_diff', count: files.length };
    } catch (e) {
        // 3. Fallback
        try {
            const fallbackRef = 'HEAD~1...HEAD';
            const output = execFileSync('git', ['diff', '--name-only', fallbackRef], { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
            const files = output.split('\n').filter(Boolean);
            return { files, source: 'head_fallback', count: files.length };
        } catch (err) {
            return { files: [], source: 'error', count: 0 };
        }
    }
}

module.exports = {
    resolveChangedFiles
};
