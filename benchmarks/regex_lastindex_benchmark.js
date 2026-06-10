const { performance } = require('perf_hooks');

const SECRET_PATTERNS = [
    /(?:api_key|apikey|secret|token|password|passwd|pwd)[\s:=]+['"]?([a-zA-Z0-9\-_]{16,})['"]?/gi,
    /ghp_[a-zA-Z0-9]{36}/g,
    /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}/g,
    /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g,
    /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/g,
];

const content = "const api_key = 'some_super_secret_key_12345'; const token = 'another_secret_token_here_54321';".repeat(100);

function runWithNewRegExp() {
    const start = performance.now();
    let redactionCount = 0;
    for (let file = 0; file < 10000; file++) { // simulate 10000 files
        let redacted = content;
        for (const pattern of SECRET_PATTERNS) {
            const re = new RegExp(pattern.source, pattern.flags);
            redacted = redacted.replace(re, () => {
                redactionCount++;
                return '<!-- REDACTED: sensitive content omitted -->';
            });
        }
    }
    const end = performance.now();
    return { time: end - start, redactionCount };
}

function runWithOriginalRegExp() {
    const start = performance.now();
    let redactionCount = 0;
    for (let file = 0; file < 10000; file++) { // simulate 10000 files
        let redacted = content;
        for (const pattern of SECRET_PATTERNS) {
            redacted = redacted.replace(pattern, () => {
                redactionCount++;
                return '<!-- REDACTED: sensitive content omitted -->';
            });
        }
    }
    const end = performance.now();
    return { time: end - start, redactionCount };
}

// Warmup
runWithNewRegExp();
runWithOriginalRegExp();

const resNew = runWithNewRegExp();
const resOrig = runWithOriginalRegExp();

console.log(`new RegExp: ${resNew.time.toFixed(2)}ms (redactions: ${resNew.redactionCount})`);
console.log(`Original RegExp: ${resOrig.time.toFixed(2)}ms (redactions: ${resOrig.redactionCount})`);
console.log(`Improvement: ${(((resNew.time - resOrig.time) / resNew.time) * 100).toFixed(2)}%`);
