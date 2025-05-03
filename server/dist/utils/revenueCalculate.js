"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRevenueSummary = void 0;
const revenueModel_1 = require("../leadModels/revenueModel");
const VisaType_1 = require("../models/VisaType");
const updateRevenueSummary = async (visaTypeId, amount) => {
    try {
        console.log("Inside updateRevenueSummary", visaTypeId, amount);
        const visaTypeInfo = await VisaType_1.VisaTypeModel.findById(visaTypeId);
        if (!visaTypeInfo) {
            console.error("VisaType not found for ID:", visaTypeId);
            return;
        }
        const visaTypeName = visaTypeInfo.visaType;
        console.log("Updating revenue for:", visaTypeName);
        await revenueModel_1.RevenueModel.findOneAndUpdate({ visaType: visaTypeName }, { $inc: { totalRevenue: amount } }, { upsert: true, new: true });
        console.log("Revenue updated successfully");
    }
    catch (error) {
        console.error("Error updating revenue summary:", error);
    }
};
exports.updateRevenueSummary = updateRevenueSummary;
