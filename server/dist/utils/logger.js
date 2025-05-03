"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, json, colorize, printf } = winston_1.format;
// Custom format for console logging with colors
const consoleLogFormat = combine(colorize(), printf(({ level, message, timestamp, ip }) => {
    return `${timestamp} ${level} ${ip ? `IP: ${ip} ` : ''}: ${message}`;
}));
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), json() // JSON format for file logging
    ),
    transports: [
        new winston_1.transports.Console({
            format: consoleLogFormat, // Custom console format with colors
        }),
        new winston_1.transports.File({
            filename: 'app.log',
        }),
    ],
});
exports.default = logger;
