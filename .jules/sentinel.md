## 2025-03-02 - Unauthenticated Socket.IO Server Access
**Vulnerability:** The Socket.IO server (`this.io = new Server(this.server)`) in `lib/server.js` was accessible without authentication, bypassing the Express basic auth.
**Learning:** In applications mixing Express API routes with Socket.IO, middleware applied to Express (`this.app.use(authMiddleware)`) does not automatically apply to Socket.IO connections.
**Prevention:** Always explicitly register authentication middleware for Socket.IO servers using `io.use(middleware)` to protect real-time data streams and interactions.
