const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const Logger = require('./Logger');
const setupRoutes = require('./routes');
const setupSocket = require('./socket');

class DashboardServer {
    constructor(port = 3000) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.port = port;
        this.logger = new Logger('GUI');

        this.setupRoutes();
        this.setupSocket();
    }

    setupRoutes() {
        setupRoutes(this.app, this.logger);
    }

    setupSocket() {
        const socketContext = setupSocket(this.io, this.logger);
        this.pollInterval = socketContext.pollInterval;
        this.watchTimeouts = socketContext.watchTimeouts;
        this.watcher = socketContext.watcher;
    }

    start() {
        this.server.listen(this.port, () => {
            this.logger.info(`Dashboard running at http://localhost:${this.port}`);
        });
    }

    stop() {
        if (this.pollInterval) clearInterval(this.pollInterval);
        if (this.watchTimeouts) this.watchTimeouts.forEach(clearTimeout);
        if (this.watcher) this.watcher.close();
        if (this.io) this.io.close();
        if (this.server) this.server.close();
    }
}

// Standalone run
if (require.main === module) {
    new DashboardServer().start();
}

module.exports = DashboardServer;
