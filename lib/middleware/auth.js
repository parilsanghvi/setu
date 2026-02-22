const { checkConfig, validate } = require('../auth/basic');

// Ensure password is provided
checkConfig();

// Rate limiting state
const FAILED_ATTEMPTS = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

const authMiddleware = (req, res, next) => {
  // 1. Allow OPTIONS requests (CORS Preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Rate Limit Check
  const ip = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
  const record = FAILED_ATTEMPTS.get(ip);

  if (record && record.blockedUntil > Date.now()) {
    return res.status(429).send('Too many failed login attempts. Please try again later.');
  }

  // Helper for failure
  const fail = (msg = 'Authentication required') => {
      const currentRecord = FAILED_ATTEMPTS.get(ip);
      const newCount = (currentRecord ? currentRecord.count : 0) + 1;
      const blockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + BLOCK_DURATION : 0;

      FAILED_ATTEMPTS.set(ip, { count: newCount, blockedUntil });

      if (blockedUntil > 0) {
        console.warn(`[Security] Blocked IP ${ip} due to too many failed login attempts.`);
      }

      res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
      return res.status(401).send(msg);
  };

  // 2. Parse Authorization Header
  const authHeader = req.headers.authorization;
  if (!authHeader) return fail();

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return fail();

  const scheme = parts[0];
  const credentials = parts[1];

  if (!scheme || scheme.toLowerCase() !== 'basic' || !credentials) return fail();

  // 3. Verify Credentials
  const decoded = Buffer.from(credentials, 'base64').toString();
  const colonIndex = decoded.indexOf(':');

  if (colonIndex === -1) return fail();

  const user = decoded.substring(0, colonIndex);
  const pass = decoded.substring(colonIndex + 1);

  if (validate(user, pass)) {
    // Reset failed attempts on success
    if (FAILED_ATTEMPTS.has(ip)) FAILED_ATTEMPTS.delete(ip);
    return next();
  }

  return fail('Invalid credentials');
};

module.exports = authMiddleware;
