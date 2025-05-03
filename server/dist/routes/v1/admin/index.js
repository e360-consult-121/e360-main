"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visaTypeRoutes_1 = __importDefault(require("./visaTypeRoutes"));
const leadRoutes_1 = __importDefault(require("./leadRoutes"));
const consultationRoutes_1 = __importDefault(require("./consultationRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
// import jotformRoutes from "./jotformRoutes"
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const visaApplicationRoutes_1 = __importDefault(require("./visaApplicationRoutes"));
const bankdetailsRoutes_1 = __importDefault(require("./bankdetailsRoutes"));
const router = (0, express_1.Router)();
router.use("/visaType", visaTypeRoutes_1.default);
router.use("/leads", leadRoutes_1.default);
router.use("/consultations", consultationRoutes_1.default);
router.use("/payment", paymentRoutes_1.default);
router.use("/dashboard", dashboardRoutes_1.default);
router.use("/visaapplication", visaApplicationRoutes_1.default);
router.use("/bankdetails", bankdetailsRoutes_1.default);
// router.use("/jotforms" , jotformRoutes);
exports.default = router;
