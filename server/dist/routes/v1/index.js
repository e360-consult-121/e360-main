"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const index_1 = __importDefault(require("./user/index"));
const index_2 = __importDefault(require("./admin/index"));
const index_3 = __importDefault(require("./visaApplication/index"));
const router = express_1.default.Router();
router.use("/auth", authRoutes_1.default);
router.use("/user", index_1.default);
router.use("/admin", index_2.default);
router.use("/visaApplications", index_3.default);
exports.default = router;
