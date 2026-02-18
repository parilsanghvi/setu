const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'lib/extensions/google-auth.deprecated.js',
    'lib/auth/google.js'
];

const SECRET_FRAGMENT = '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';
let foundSecrets = false;

filesToCheck.forEach(file => {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
        if (content.includes(SECRET_FRAGMENT)) {
            console.error(`[FAIL] Found hardcoded secret in ${file}`);
            foundSecrets = true;
        } else {
            console.log(`[PASS] No hardcoded secret in ${file}`);
        }
    } catch (e) {
        console.error(`[ERROR] Could not read ${file}:`, e.message);
    }
});

if (foundSecrets) {
    console.error('Hardcoded secrets found!');
    process.exit(1);
} else {
    console.log('No hardcoded secrets found.');
    process.exit(0);
}
