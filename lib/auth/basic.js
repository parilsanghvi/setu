const crypto = require('crypto');

// Default credentials
const DEFAULT_USER = 'admin';

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

    return crypto.timingSafeEqual(userHash, validUserHash) &&
           crypto.timingSafeEqual(passHash, validPassHash);
  } catch (e) {
    return false;
  }
}

module.exports = {
  checkConfig,
  validate
};
