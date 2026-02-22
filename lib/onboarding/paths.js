const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '../../');
const SETU_DIR = path.join(REPO_ROOT, '.setu');

function getSetuPath(filename = '') {
    if (!fs.existsSync(SETU_DIR)) {
        fs.mkdirSync(SETU_DIR, { recursive: true });
    }
    return path.join(SETU_DIR, filename);
}

module.exports = {
    getSetuPath,
    REPO_ROOT
};
