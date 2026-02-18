class Logger {
    constructor(name) {
        this.name = name;
    }

    _log(level, message, ...args) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            name: this.name,
            message
        };

        if (args.length > 0) {
            // Find error object if any
            const error = args.find(a => a instanceof Error);
            if (error) {
                entry.error = {
                    message: error.message,
                    stack: error.stack,
                    ...error
                };
            }

            // Add other args
            const otherArgs = args.filter(a => !(a instanceof Error));
            if (otherArgs.length > 0) {
                if (otherArgs.length === 1 && typeof otherArgs[0] === 'object') {
                    Object.assign(entry, otherArgs[0]);
                } else {
                    entry.args = otherArgs;
                }
            }
        }

        const json = JSON.stringify(entry);
        if (level === 'error') {
            console.error(json);
        } else {
            console.log(json);
        }
    }

    info(message, ...args) { this._log('info', message, ...args); }
    warn(message, ...args) { this._log('warn', message, ...args); }
    error(message, ...args) { this._log('error', message, ...args); }
    debug(message, ...args) { this._log('debug', message, ...args); }
}

module.exports = Logger;
