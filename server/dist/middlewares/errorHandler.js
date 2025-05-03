"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../utils/appError"));
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error,
    });
};
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Something went wrong! Please try again later.",
        });
    }
};
const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const errorMessages = errors.join(". ");
    const msg = `Invalid input data: ${errorMessages}`;
    return new appError_1.default(msg, http_status_codes_1.StatusCodes.BAD_REQUEST);
};
const duplicateKeyErrorHandler = (err) => {
    const field = Object.keys(err.keyValue).join(", ");
    const msg = `Duplicate field: ${field}. Please use another value!`;
    return new appError_1.default(msg, http_status_codes_1.StatusCodes.BAD_REQUEST);
};
const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`;
    return new appError_1.default(msg, http_status_codes_1.StatusCodes.BAD_REQUEST);
};
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("---errorHandlerMiddleware---");
    err.statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    err.status = err.status || "error";
    console.log(err);
    if (!(err instanceof appError_1.default)) {
        err = new appError_1.default(err.message || "Something went wrong, try again later", err.statusCode);
    }
    if (process.env.NODE_ENV === "development") {
        devErrors(res, err);
    }
    else if (process.env.NODE_ENV === "production") {
        console.log("prod error");
        if (err.name === "ValidationError") {
            err = validationErrorHandler(err);
        }
        else if (err.code === 11000) {
            err = duplicateKeyErrorHandler(err);
        }
        else if (err.name === "CastError") {
            err = castErrorHandler(err);
        }
        prodErrors(res, err);
    }
};
exports.default = errorHandlerMiddleware;
