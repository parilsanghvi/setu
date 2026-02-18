const crypto = require('crypto');

// Default credentials
const DEFAULT_USER = 'admin';
let DEFAULT_PASS = process.env.DASHBOARD_PASS;

// Ensure password is provided
if (!DEFAULT_PASS && process.env.DISABLE_DASHBOARD_AUTH !== 'true') {
  console.error('\n---------------------------------------------------');
  console.error('❌ DASHBOARD AUTHENTICATION ERROR');
  console.error('   DASHBOARD_PASS environment variable is not set.');
  console.error('   Access to the dashboard is disabled for security.');
  console.error('   Please set DASHBOARD_PASS or DISABLE_DASHBOARD_AUTH=true (dev only).');
  console.error('---------------------------------------------------\n');
}

const authMiddleware = (req, res, next) => {
  // 1. Bypass if Auth is disabled (e.g. for dev/testing)
  if (process.env.DISABLE_DASHBOARD_AUTH === 'true') {
    return next();
  }

  // 2. Allow OPTIONS requests (CORS Preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 3. Parse Authorization Header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
    return res.status(401).send('Authentication required');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
      return res.status(401).send('Authentication required');
  }

  const scheme = parts[0];
  const credentials = parts[1];

  if (!scheme || scheme.toLowerCase() !== 'basic' || !credentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
    return res.status(401).send('Authentication required');
  }

  // 4. Verify Credentials
  const decoded = Buffer.from(credentials, 'base64').toString();
  const colonIndex = decoded.indexOf(':');

  if (colonIndex === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
    return res.status(401).send('Authentication required');
  }

  const user = decoded.substring(0, colonIndex);
  const pass = decoded.substring(colonIndex + 1);

  const validUser = process.env.DASHBOARD_USER || DEFAULT_USER;
  const validPass = process.env.DASHBOARD_PASS || DEFAULT_PASS;

  if (!validPass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
    return res.status(500).send('Authentication not configured');
  }

  // Timing-safe comparison using SHA-256 hashes
  const userHash = crypto.createHash('sha256').update(user).digest();
  const validUserHash = crypto.createHash('sha256').update(validUser).digest();

  const passHash = crypto.createHash('sha256').update(pass).digest();
  const validPassHash = crypto.createHash('sha256').update(validPass).digest();

  if (crypto.timingSafeEqual(userHash, validUserHash) && crypto.timingSafeEqual(passHash, validPassHash)) {
    return next();
  }

  // Auth Failed
  res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
  return res.status(401).send('Invalid credentials');
};

module.exports = authMiddleware;
