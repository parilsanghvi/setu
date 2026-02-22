const fs = require('fs');
const path = require('path');

// Convert a CODEOWNERS pattern into a Regex
function patternToRegex(pattern) {
    // Escape standard regex characters except * and ?
    let regexStr = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');

    // If it starts with a slash, it matches from the root
    if (regexStr.startsWith('/')) {
        regexStr = '^' + regexStr.slice(1);
    } else {
        // Otherwise, it can match anywhere
        regexStr = '(^|/)' + regexStr;
    }

    // If it ends with a slash, it matches a directory and everything inside
    // If it doesn't end with a slash, it could match a file or a directory
    if (regexStr.endsWith('/')) {
        regexStr = regexStr + '.*';
    } else {
        // A pattern without a trailing slash matches both files and directories, 
        // but typically in CODEOWNERS it's a structural match, 
        // to simplify we add an optional trailing separator and anything inside if it's a dir,
        // or just the end of the string.
        regexStr = regexStr + '($|/.*)';
    }

    // Replace ** with .*
    // We do a small hack: temporarily replace \*\* with a unique placeholder so we don't mix up with *
    regexStr = regexStr.replace(/\\\*\\\*/g, '___DBL_STAR___');

    // Replace * with [^/]* (match anything except slash)
    regexStr = regexStr.replace(/\\\*/g, '[^/]*');

    // Put .* back for **
    regexStr = regexStr.replace(/___DBL_STAR___/g, '.*');

    // Replace ? with [^/]
    regexStr = regexStr.replace(/\\\?/g, '[^/]');

    return new RegExp(regexStr);
}

function parseCodeowners(filePath) {
    const rules = [];
    if (!fs.existsSync(filePath)) return rules;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        let text = line.trim();
        if (!text || text.startsWith('#')) return;

        // Codeowners lines: pattern owner1 owner2 ... (owners can be @username, email, or team)
        // Need to be careful about escaped spaces in patterns, but standard CODEOWNERS splits by space.
        // Assuming no escaped spaces in paths for simplicity, standard approach:
        const parts = text.split(/\s+/);
        if (parts.length < 2) return;

        const pattern = parts[0];
        const owners = parts.slice(1).map(o => o.replace(/^@/, '')); // strip @ for consistency

        rules.push({
            lineNumber: index + 1,
            pattern: pattern,
            regex: patternToRegex(pattern),
            owners: owners,
            raw: text
        });
    });

    return rules;
}

// Last match wins in CODEOWNERS
function matchCodeowners(rules, targetPath) {
    let match = null;

    for (const rule of rules) {
        if (rule.regex.test(targetPath)) {
            match = rule;
        }
    }
    return match;
}

module.exports = {
    parseCodeowners,
    matchCodeowners
};
