const crypto = require('crypto');

// Default credentials
const DEFAULT_USER = 'admin';
let DEFAULT_PASS = process.env.DASHBOARD_PASS;

// Generate a random password if none is set
if (!DEFAULT_PASS && process.env.DISABLE_DASHBOARD_AUTH !== 'true') {
  // Only generate if DISABLE_DASHBOARD_AUTH is NOT true
  // This avoids noisy logs in dev mode if disable flag is set
  DEFAULT_PASS = crypto.randomBytes(8).toString('hex');

  // Log once
  console.log('\n---------------------------------------------------');
  console.log('🔒 DASHBOARD AUTHENTICATION ENABLED (Security Fix)');
  console.log(`👤 User:     ${process.env.DASHBOARD_USER || DEFAULT_USER}`);
  console.log(`🔑 Password: ${DEFAULT_PASS}`);
  console.log('---------------------------------------------------\n');
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

  // Simple string comparison (for Basic Auth on a local dashboard this is acceptable)
  if (user === validUser && pass === validPass) {
    return next();
  }

  // Auth Failed
  res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
  return res.status(401).send('Invalid credentials');
};

module.exports = authMiddleware;
