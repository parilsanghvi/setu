const { validate } = require('../auth/basic');

const socketAuth = (socket, next) => {
  const authHeader = socket.handshake.headers.authorization;

  if (!authHeader) {
    return next(new Error('Authentication required'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') {
    return next(new Error('Authentication required'));
  }

  const credentials = parts[1];
  const decoded = Buffer.from(credentials, 'base64').toString();
  const colonIndex = decoded.indexOf(':');

  if (colonIndex === -1) {
    return next(new Error('Authentication required'));
  }

  const user = decoded.substring(0, colonIndex);
  const pass = decoded.substring(colonIndex + 1);

  if (validate(user, pass)) {
    return next();
  }

  return next(new Error('Invalid credentials'));
};

module.exports = socketAuth;
