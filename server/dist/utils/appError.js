"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        if (details !== null && details !== undefined) {
            this.details = details;
        }
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
