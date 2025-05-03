"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticate = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const appError_1 = __importDefault(require("../utils/appError"));
const enums_1 = require("../types/enums/enums");
const authenticate = (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return next(new appError_1.default("Token must be provided", 401));
    }
    try {
        const payload = (0, jwtUtils_1.verifyAccessToken)(token);
        if (payload && payload.role === enums_1.RoleEnum.ADMIN) {
            req.admin = payload; // if admin
            return next();
        }
        else if (payload && payload.role === enums_1.RoleEnum.USER) {
            req.user = payload; // if customer/ user
            return next();
        }
        else {
            return next(new appError_1.default("Unauthorized: Invalid token", 401));
        }
    }
    catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
// for authorziation of Admin
const authorizeAdmin = (req, res, next) => {
    if (!req.admin) {
        return next(new appError_1.default("Access denied: Admins only", 403));
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
