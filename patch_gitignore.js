const fs = require('fs');
let gitignore = fs.readFileSync('.gitignore', 'utf8');
gitignore = gitignore.replace('playwright-report/\n', 'frontend/app/playwright-report/\n');
gitignore = gitignore.replace('test-results/\n', 'frontend/app/test-results/\n');
fs.writeFileSync('.gitignore', gitignore);
