"use strict";
// models/monthlyLeadStats.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyLeadStats = void 0;
const mongoose_1 = require("mongoose");
const monthlyLeadStatsSchema = new mongoose_1.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    leadCount: { type: Number, default: 0 },
    conversionCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    pendingApplications: { type: Number, default: 0 },
    completedApplications: { type: Number, default: 0 },
}, { timestamps: true });
monthlyLeadStatsSchema.index({ year: 1, month: 1 }, { unique: true });
exports.MonthlyLeadStats = (0, mongoose_1.model)("MonthlyLeadStats", monthlyLeadStatsSchema);
