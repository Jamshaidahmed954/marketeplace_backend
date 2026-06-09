/**
 * Logger Utility
 * A lightweight, structured logger with coloured console output.
 * Levels: error | warn | info | http | debug
 *
 * Usage:
 *   import logger from '../../utils/logger.js';
 *   logger.info('Server started', { port: 3000 });
 *   logger.error('DB connection failed', { err: error.message });
 */

import env from "../config/env.js";

// ANSI colour codes
const COLOURS = {
    reset:  "\x1b[0m",
    red:    "\x1b[31m",
    yellow: "\x1b[33m",
    cyan:   "\x1b[36m",
    green:  "\x1b[32m",
    blue:   "\x1b[34m",
    grey:   "\x1b[90m",
};

const LEVEL_CONFIG = {
    error: { priority: 0, label: "ERROR", colour: COLOURS.red    },
    warn:  { priority: 1, label: "WARN ", colour: COLOURS.yellow },
    info:  { priority: 2, label: "INFO ", colour: COLOURS.cyan   },
    http:  { priority: 3, label: "HTTP ", colour: COLOURS.green  },
    debug: { priority: 4, label: "DEBUG", colour: COLOURS.grey   },
};

// In production only log up to 'info'; in dev/test log everything
const ACTIVE_PRIORITY = env.nodeEnv === "production" ? 2 : 4;

/**
 * Core log function.
 * @param {'error'|'warn'|'info'|'http'|'debug'} level
 * @param {string} message
 * @param {object} [meta]
 */
const log = (level, message, meta = {}) => {
    const config = LEVEL_CONFIG[level];
    if (!config) return;
    if (config.priority > ACTIVE_PRIORITY) return;

    const timestamp = new Date().toISOString();
    const prefix = `${COLOURS.grey}[${timestamp}]${COLOURS.reset} ${config.colour}[${config.label}]${COLOURS.reset}`;

    const metaStr = Object.keys(meta).length
        ? `\n          ${COLOURS.grey}${JSON.stringify(meta, null, 2)}${COLOURS.reset}`
        : "";

    const output = `${prefix} ${message}${metaStr}`;

    if (level === "error") {
        console.error(output);
    } else if (level === "warn") {
        console.warn(output);
    } else {
        console.log(output);
    }
};

const logger = {
    error: (message, meta)  => log("error", message, meta),
    warn:  (message, meta)  => log("warn",  message, meta),
    info:  (message, meta)  => log("info",  message, meta),
    http:  (message, meta)  => log("http",  message, meta),
    debug: (message, meta)  => log("debug", message, meta),
};

export default logger;
