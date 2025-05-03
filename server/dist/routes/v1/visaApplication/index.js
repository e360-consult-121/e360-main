"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientSideRoutes_1 = __importDefault(require("./clientSideRoutes"));
const adminSideRoutes_1 = __importDefault(require("./adminSideRoutes"));
const commonRoutes_1 = __importDefault(require("./commonRoutes"));
const router = (0, express_1.Router)();
router.use("/admin-side", adminSideRoutes_1.default);
router.use("/client-side", clientSideRoutes_1.default);
router.use("/common", commonRoutes_1.default);
exports.default = router;
