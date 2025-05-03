"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../types/enums/enums");
const revenueSummarySchema = new mongoose_1.Schema({
    visaType: {
        type: String,
        enum: Object.values(enums_1.VisaTypeEnum),
        required: true,
        unique: true,
    },
    totalRevenue: {
        type: Number,
        required: true,
    }
});
exports.RevenueModel = (0, mongoose_1.model)("RevenueSummary", revenueSummarySchema);
