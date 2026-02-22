#!/usr/bin/env node

const { getOnboardingStatus } = require('../lib/onboarding/status');

const status = getOnboardingStatus();

console.log(JSON.stringify(status, null, 2));

const fs = require('fs');
const path = require('path');
const { getSetuPath } = require('../lib/onboarding/paths');

const logPath = getSetuPath('onboarding-history.jsonl');

try {
  const { getActiveProfile } = require('../lib/onboarding/governance-profiles');
  const profile = getActiveProfile();
  const maxRecords = parseInt(process.env.SETU_DRIFT_HISTORY_MAX) || profile.config.telemetry_max || 500;
  const maxDays = parseInt(process.env.SETU_DRIFT_HISTORY_DAYS) || profile.config.telemetry_days || 30;

  let existingLines = [];
  if (fs.existsSync(logPath)) {
    existingLines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
  }

  const now = new Date().getTime();
  const maxMs = maxDays * 24 * 60 * 60 * 1000;

  existingLines = existingLines.filter(line => {
    try {
      const data = JSON.parse(line);
      if (!data.timestamp) return false;
      return (now - new Date(data.timestamp).getTime()) <= maxMs;
    } catch (e) { return false; }
  });

  if (existingLines.length >= maxRecords) {
    existingLines = existingLines.slice(existingLines.length - maxRecords + 1);
  }

  const snapshot = {
    timestamp: new Date().toISOString(),
    completeness: status.completeness,
    artifacts_present: status.artifacts_present,
    artifacts_missing: status.artifacts_missing,
    missing_docs_count: status.missing.length,
    ok: status.ok
  };

  existingLines.push(JSON.stringify(snapshot));

  if (!fs.existsSync(path.dirname(logPath))) {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
  }
  fs.writeFileSync(logPath, existingLines.join('\n') + '\n');
} catch (e) {
  // Silently fail telemetry on error so it doesn't break CI statuses broadly
}

if (!status.ok) {
  process.exit(1);
} else {
  process.exit(0);
}
