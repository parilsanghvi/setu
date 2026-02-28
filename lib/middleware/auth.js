const { checkConfig, validate } = require('../auth/basic');

// Ensure password is provided
checkConfig();

// Rate limiting state
const FAILED_ATTEMPTS = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Automatic cleanup of expired rate limit entries
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of FAILED_ATTEMPTS.entries()) {
    // Remove if block expired
    if (record.blockedUntil > 0 && record.blockedUntil < now) {
      FAILED_ATTEMPTS.delete(ip);
    }
    // Remove stale partial failures (older than block duration)
    else if (record.lastAttempt && (now - record.lastAttempt > BLOCK_DURATION)) {
       FAILED_ATTEMPTS.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

// Unref to not block process exit
cleanupInterval.unref();

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
      const now = Date.now();
      const currentRecord = FAILED_ATTEMPTS.get(ip);
      const newCount = (currentRecord ? currentRecord.count : 0) + 1;
      const blockedUntil = newCount >= MAX_ATTEMPTS ? now + BLOCK_DURATION : 0;

      FAILED_ATTEMPTS.set(ip, {
        count: newCount,
        blockedUntil,
        lastAttempt: now
      });

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

// Test Helpers
if (process.env.NODE_ENV === 'test') {
  module.exports._getMapSize = () => FAILED_ATTEMPTS.size;
  // Reset helper for independent tests
  module.exports._resetMap = () => FAILED_ATTEMPTS.clear();
  module.exports._runCleanup = (nowOverride) => {
    const now = nowOverride || Date.now();
    for (const [ip, record] of FAILED_ATTEMPTS.entries()) {
      if (record.blockedUntil > 0 && record.blockedUntil < now) {
        FAILED_ATTEMPTS.delete(ip);
      } else if (record.lastAttempt && (now - record.lastAttempt > BLOCK_DURATION)) {
         FAILED_ATTEMPTS.delete(ip);
      }
    }
  };
}
