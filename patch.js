const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');

content = content.replace(
  /app\.get\('\/api\/onboarding-trend', \(req, res\) => \{\s*try \{\s*const logPath = getSetuPath\('onboarding-history\.jsonl'\);\s*if \(!fs\.existsSync\(logPath\)\) \{\s*return res\.json\(\{ runs: \[\], error: 'No history found' \}\);\s*\}\s*const lines = fs\.readFileSync\(logPath, 'utf8'\)\.split\('\\n'\)\.filter\(Boolean\);/,
  `app.get('/api/onboarding-trend', async (req, res) => {
  try {
    const logPath = getSetuPath('onboarding-history.jsonl');
    if (!fs.existsSync(logPath)) {
      return res.json({ runs: [], error: 'No history found' });
    }
    const content = await fs.promises.readFile(logPath, 'utf8');
    const lines = content.split('\\n').filter(Boolean);`
);

content = content.replace(
  /app\.get\('\/api\/drift-trend', \(req, res\) => \{\s*try \{\s*const logPath = getSetuPath\('drift-history\.jsonl'\);\s*if \(!fs\.existsSync\(logPath\)\) \{\s*return res\.json\(\{ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N\/A' \}\);\s*\}\s*const lines = fs\.readFileSync\(logPath, 'utf8'\)\.split\('\\n'\)\.filter\(Boolean\);/,
  `app.get('/api/drift-trend', async (req, res) => {
  try {
    const logPath = getSetuPath('drift-history.jsonl');
    if (!fs.existsSync(logPath)) {
      return res.json({ total_runs: 0, fail_rate: 0, drift_percent: 0, top_missing: 'N/A' });
    }
    const content = await fs.promises.readFile(logPath, 'utf8');
    const lines = content.split('\\n').filter(Boolean);`
);

fs.writeFileSync('index.js', content);
console.log('Patched index.js');
