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
        this.teardownSocket = setupSocket(this.io, this.logger);
    }

    start() {
        this.server.listen(this.port, () => {
            this.logger.info(`Dashboard running at http://localhost:${this.port}`);
        });
    }

    stop() {
        if (this.teardownSocket) this.teardownSocket();
        if (this.io) this.io.close();
        if (this.server) this.server.close();
    }
}

// Standalone run
if (require.main === module) {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    new DashboardServer(port).start();
}

module.exports = DashboardServer;
