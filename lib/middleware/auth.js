const { checkConfig, validate } = require('../auth/basic');

// Ensure password is provided
checkConfig();

const authMiddleware = (req, res, next) => {
  // 1. Allow OPTIONS requests (CORS Preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 2. Parse Authorization Header
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

  // 3. Verify Credentials
  const decoded = Buffer.from(credentials, 'base64').toString();
  const colonIndex = decoded.indexOf(':');

  if (colonIndex === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
    return res.status(401).send('Authentication required');
  }

  const user = decoded.substring(0, colonIndex);
  const pass = decoded.substring(colonIndex + 1);

  if (validate(user, pass)) {
    return next();
  }

  // Auth Failed
  res.setHeader('WWW-Authenticate', 'Basic realm="Setu Dashboard"');
  return res.status(401).send('Invalid credentials');
};

module.exports = authMiddleware;
