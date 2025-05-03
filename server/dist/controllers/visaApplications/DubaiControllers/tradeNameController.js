"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTradeNameInfo = exports.fetchAssignedTradeName = exports.rejectChangeReq = exports.approveChangeReq = exports.sendChangeRequest = exports.assignOneTradeName = exports.fetchTradeNameOptions = exports.uploadTradeNameOptions = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const tradeNameModel_1 = require("../../../extraModels/tradeNameModel");
const enums_1 = require("../../../types/enums/enums");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const VisaApplicationStepStatus_1 = require("../../../models/VisaApplicationStepStatus");
// For user
const uploadTradeNameOptions = async (req, res, next) => {
    const { stepStatusId } = req.params;
    const { options } = req.body;
    if (!Array.isArray(options) || options.length !== 3) {
        return next(new appError_1.default("Exactly 3 trade name options are required.", 400));
    }
    const existing = await tradeNameModel_1.TradeNameModel.findOne({ stepStatusId });
    if (existing) {
        return next(new appError_1.default("Trade name options already uploaded for this stepStatusId.", 400));
    }
    const aggregationResult = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(stepStatusId) } },
        {
            $lookup: {
                from: "visasteps",
                localField: "stepId",
                foreignField: "_id",
                as: "visaStep",
            },
        },
        { $unwind: "$visaStep" },
        {
            $lookup: {
                from: "visatypes",
                localField: "visaTypeId",
                foreignField: "_id",
                as: "visaType",
            },
        },
        { $unwind: "$visaType" },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $project: {
                visaApplicationId: 1,
                visaStepId: 1,
                visaTypeId: 1,
                userId: 1,
                "visaStep.emailTriggers": 1,
                "visaType.visaType": 1,
                "user.email": 1,
                "user.name": 1,
            },
        },
    ]).exec();
    console.log("Aggregation Result:", aggregationResult);
    if (!aggregationResult.length) {
        return next(new appError_1.default("Required data not found", 404));
    }
    const data = aggregationResult[0];
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.create({
        stepStatusId,
        options,
        status: enums_1.tradeNameStatus.TradeNames_Uploaded,
    });
    await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
        triggers: data.visaStep.emailTriggers,
        stepStatus: enums_1.StepStatusEnum.SUBMITTED,
        visaType: data.visaType.visaType,
        email: data.user.email,
        firstName: data.user.name,
    });
    res.status(201).json({
        message: "Trade name options uploaded successfully.",
        tradeNameDoc,
    });
};
exports.uploadTradeNameOptions = uploadTradeNameOptions;
// Admin side
const fetchTradeNameOptions = async (req, res) => {
    const { stepStatusId } = req.params;
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOne({ stepStatusId });
    if (!tradeNameDoc) {
        res.status(404);
        throw new Error("Trade name options not found for this stepStatusId.");
    }
    return res.status(200).json({
        message: "Trade name options fetched successfully.",
        Options: tradeNameDoc.options,
    });
};
exports.fetchTradeNameOptions = fetchTradeNameOptions;
// Admin side
const assignOneTradeName = async (req, res) => {
    const { stepStatusId } = req.params;
    const { assignedName } = req.body;
    if (!assignedName) {
        res.status(400);
        throw new Error("Assigned name is required.");
        return;
    }
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOneAndUpdate({ stepStatusId }, { assignedName, status: enums_1.tradeNameStatus.TradeName_Assigned }, { new: true } // Return the updated document
    );
    if (!tradeNameDoc) {
        res.status(404);
        throw new Error("Trade name options not found for this stepStatusId.");
    }
    return res.status(200).json({
        message: "Trade name assigned successfully.",
        tradeNameDoc,
    });
};
exports.assignOneTradeName = assignOneTradeName;
// For user
const sendChangeRequest = async (req, res) => {
    const { stepStatusId } = req.params;
    const { options, reasonOfChange } = req.body;
    // Validate that exactly 3 options are provided
    if (!Array.isArray(options) || options.length !== 3) {
        res.status(400);
        throw new Error("Exactly 3 trade name options are required.");
    }
    // Check that reasonOfChange is provided
    if (!reasonOfChange) {
        res.status(400);
        throw new Error("Reason for change is required.");
    }
    // Find and update the document
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOneAndUpdate({ stepStatusId }, { options, reasonOfChange, status: enums_1.tradeNameStatus.ChangeReq_Sent }, { new: true } // Return the updated document
    );
    if (!tradeNameDoc) {
        res.status(404);
        throw new Error("Trade name options not found for this stepStatusId.");
    }
    return res.status(200).json({
        message: "Trade name options changed successfully.",
        tradeNameDoc,
    });
};
exports.sendChangeRequest = sendChangeRequest;
// For Admin
const approveChangeReq = async (req, res) => {
    const { stepStatusId } = req.params;
    const { assignedName } = req.body;
    if (!assignedName) {
        res.status(400);
        throw new Error("Assigned name is required.");
    }
    // Find the document first to validate assignedName
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOne({ stepStatusId });
    if (!tradeNameDoc) {
        res.status(404);
        throw new Error("Trade name options not found for this stepStatusId.");
    }
    // Update the document
    tradeNameDoc.assignedName = assignedName;
    tradeNameDoc.status = enums_1.tradeNameStatus.ChangeReq_Approved;
    await tradeNameDoc.save();
    return res.status(200).json({
        message: "Trade name change approved and assigned successfully.",
        tradeNameDoc,
    });
};
exports.approveChangeReq = approveChangeReq;
// For Admin
const rejectChangeReq = async (req, res) => {
    const { stepStatusId } = req.params;
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOneAndUpdate({ stepStatusId }, { reasonOfChange: null, status: enums_1.tradeNameStatus.ChangeReq_Rejected }, { new: true });
    if (!tradeNameDoc) {
        res.status(404);
        throw new Error("Trade name options not found for this stepStatusId.");
    }
    return res.status(200).json({
        message: "Trade name change request rejected successfully.",
        tradeNameStatus: tradeNameDoc.status,
    });
};
exports.rejectChangeReq = rejectChangeReq;
// For user
const fetchAssignedTradeName = async (req, res) => {
    const { stepStatusId } = req.params;
    const tradeNameDoc = await tradeNameModel_1.TradeNameModel.findOne({ stepStatusId }, { assignedName: 1, _id: 0 });
    if (!tradeNameDoc || !tradeNameDoc.assignedName) {
        res.status(404);
        throw new Error("Final trade name not found or not assigned yet.");
    }
    return res.status(200).json({
        message: "Final trade name fetched successfully.",
        assignedName: tradeNameDoc.assignedName,
    });
};
exports.fetchAssignedTradeName = fetchAssignedTradeName;
// for common
const fetchTradeNameInfo = async (req, res) => {
    const { stepStatusId } = req.params;
    const tradeName = await tradeNameModel_1.TradeNameModel.findOne({ stepStatusId }, { options: 1, assignedName: 1, status: 1, reasonOfChange: 1 });
    if (!tradeName) {
        return res
            .status(200)
            .json({
            success: false,
            message: "Preferences Not Submitted",
            data: null,
        });
    }
    res.status(200).json({
        success: true,
        data: {
            options: tradeName.options,
            assignedName: tradeName.assignedName,
            status: tradeName.status,
            reasonOfChange: tradeName.reasonOfChange,
        },
    });
};
exports.fetchTradeNameInfo = fetchTradeNameInfo;
// return wala case bhi dekhna hai ....
