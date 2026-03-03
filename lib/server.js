const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const helmet = require('helmet');
const authMiddleware = require('./middleware/auth');
const Logger = require('./Logger');
const { setupApiRoutes } = require('./routes/api');
const DashboardSocket = require('./sockets/dashboard');

class DashboardServer {
    constructor(port = 3000) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.port = port;
        this.logger = new Logger('GUI');

        this.dashboardSocket = new DashboardSocket(this.io, this.logger);

        this.setupRoutes();
        this.setupSocket();
    }

    setupRoutes() {
        // Security Headers
        this.app.use(helmet());

        // 🛡️ Security: Authentication Middleware
        this.app.use(authMiddleware);

        // Serve Screenshots securely
        this.app.use('/screenshots', express.static(path.join(__dirname, '../frontend/dashboard/screenshots'), { index: false }));

        // Serve Static Files
        this.app.use(express.static(path.join(__dirname, '../frontend/dashboard')));

        // Setup API Routes
        setupApiRoutes(this.app, this.logger);
    }

    setupSocket() {
        this.dashboardSocket.setup();
    }

    start() {
        this.server.listen(this.port, () => {
            this.logger.info(`Dashboard running at http://localhost:${this.port}`);
        });
    }

    stop() {
        this.dashboardSocket.stop();
        if (this.io) this.io.close();
        if (this.server) this.server.close();
    }
}

// Standalone run
if (require.main === module) {
    new DashboardServer().start();
}

module.exports = DashboardServer;
