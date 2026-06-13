const crypto = require('crypto');

// Default credentials
const DEFAULT_USER = 'admin';

// Rate limiting state to prevent brute-force attacks on basic auth
let failedAttempts = 0;
let blockedUntil = 0;
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

function checkConfig() {
  if (!process.env.DASHBOARD_PASS) {
    console.error('\n---------------------------------------------------');
    console.error('❌ DASHBOARD AUTHENTICATION ERROR');
    console.error('   DASHBOARD_PASS environment variable is not set.');
    console.error('   Access to the dashboard is disabled for security.');
    console.error('   Please set DASHBOARD_PASS in .env');
    console.error('---------------------------------------------------\n');
    return false;
  }
  return true;
}

function validate(user, pass) {
  const now = Date.now();

  // Check if currently blocked
  if (blockedUntil > now) {
    return false;
  }

  // Reset counters if block has expired
  if (blockedUntil > 0 && blockedUntil <= now) {
    blockedUntil = 0;
    failedAttempts = 0;
  }

  const validUser = process.env.DASHBOARD_USER || DEFAULT_USER;
  const validPass = process.env.DASHBOARD_PASS;

  if (!validPass) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  try {
    const userHash = crypto.createHash('sha256').update(user).digest();
    const validUserHash = crypto.createHash('sha256').update(validUser).digest();

    const passHash = crypto.createHash('sha256').update(pass).digest();
    const validPassHash = crypto.createHash('sha256').update(validPass).digest();

    const isValid = crypto.timingSafeEqual(userHash, validUserHash) &&
           crypto.timingSafeEqual(passHash, validPassHash);

    if (isValid) {
      // Reset rate limiting on success
      failedAttempts = 0;
      blockedUntil = 0;
      return true;
    } else {
      // Record failure and block if threshold reached
      failedAttempts++;
      if (failedAttempts >= MAX_ATTEMPTS) {
        blockedUntil = now + BLOCK_DURATION;
      }
      return false;
    }
  } catch (e) {
    return false;
  }
}

module.exports = {
  checkConfig,
  validate
};
