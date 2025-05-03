"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsReupload = exports.markAsVerified = exports.rejectStep = exports.approveStep = void 0;
const VisaApplication_1 = require("../../models/VisaApplication");
const VisaStep_1 = require("../../models/VisaStep");
const VisaApplicationStepStatus_1 = require("../../models/VisaApplicationStepStatus");
const VisaStepRequirement_1 = require("../../models/VisaStepRequirement");
const VisaApplicationReqStatus_1 = require("../../models/VisaApplicationReqStatus");
const aimaModel_1 = require("../../extraModels/aimaModel");
const enums_1 = require("../../types/enums/enums");
const applicationTriggerSegregate_1 = require("../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const mongoose_1 = __importDefault(require("mongoose"));
// Approve click on step
const approveStep = async (req, res) => {
    const { visaApplicationId } = req.params;
    if (!visaApplicationId) {
        return res.status(400).json({ error: "visaApplicationId is required." });
    }
    const appData = await VisaApplication_1.VisaApplicationModel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(visaApplicationId) } },
        {
            $lookup: {
                from: "users", // assuming collection name
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "visatypes", // assuming collection name
                localField: "visaTypeId",
                foreignField: "_id",
                as: "visaType",
            },
        },
        { $unwind: "$visaType" },
        {
            $lookup: {
                from: "visasteps", // assuming collection name
                let: { visaTypeId: "$visaTypeId", currentStep: "$currentStep" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$visaTypeId", "$$visaTypeId"] },
                                    { $eq: ["$stepNumber", "$$currentStep"] },
                                ],
                            },
                        },
                    },
                ],
                as: "currentStepDoc",
            },
        },
        { $unwind: "$currentStepDoc" },
        {
            $lookup: {
                from: "visaapplicationstepstatuses", // assuming collection name
                let: {
                    stepId: "$currentStepDoc._id",
                    visaAppId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$stepId", "$$stepId"] },
                                    { $eq: ["$visaApplicationId", "$$visaAppId"] },
                                ],
                            },
                        },
                    },
                ],
                as: "currentStepStatusDoc",
            },
        },
        { $unwind: "$currentStepStatusDoc" },
        {
            $lookup: {
                from: "visasteps", // assuming collection name
                let: {
                    visaTypeId: "$visaTypeId",
                    nextStep: { $add: ["$currentStep", 1] },
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$visaTypeId", "$$visaTypeId"] },
                                    { $eq: ["$stepNumber", "$$nextStep"] },
                                ],
                            },
                        },
                    },
                ],
                as: "nextStepDoc",
            },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                visaTypeId: 1,
                currentStep: 1,
                "user.name": 1,
                "user.email": 1,
                "visaType.visaType": 1,
                currentStepDoc: 1,
                currentStepStatusDoc: 1,
                nextStepDoc: { $arrayElemAt: ["$nextStepDoc", 0] },
            },
        },
    ]);
    if (!appData.length) {
        return res
            .status(404)
            .json({ error: "Visa Application or related data not found." });
    }
    const data = appData[0];
    await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.updateMany({
        visaApplicationId,
        stepId: data.currentStepDoc._id,
    }, {
        $set: {
            status: enums_1.visaApplicationReqStatusEnum.VERIFIED,
        },
    });
    await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findByIdAndUpdate(data.currentStepStatusDoc._id, {
        $set: { status: enums_1.StepStatusEnum.APPROVED },
    });
    console.log(data);
    if (data.currentStepDoc.emailTriggers) {
        await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
            triggers: data.currentStepDoc.emailTriggers,
            stepStatus: enums_1.StepStatusEnum.APPROVED,
            visaType: data.visaType.visaType,
            email: data.user.email,
            firstName: data.user.name,
        });
    }
    if (!data.nextStepDoc) {
        return res.status(200).json({
            message: "Step approved. No next step found (final step).",
        });
    }
    const newStepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.create({
        userId: data.userId,
        visaTypeId: data.visaTypeId,
        stepId: data.nextStepDoc._id,
        visaApplicationId,
        status: enums_1.StepStatusEnum.IN_PROGRESS,
        reqFilled: {},
    });
    if (data.nextStepDoc.stepType === enums_1.StepTypeEnum.AIMA) {
        const phases = [
            enums_1.aimaStatusEnum.Application_Approved,
            enums_1.aimaStatusEnum.Appointment_Confirmed,
            enums_1.aimaStatusEnum.Visa_Approved,
            enums_1.aimaStatusEnum.Appointment_Scheduled,
        ];
        await aimaModel_1.aimaModel.insertMany(phases.map((status) => ({
            aimaStatus: status,
            isCompleted: false,
            completedOn: null,
            aimaNumber: null,
            stepStatusId: newStepStatusDoc._id,
        })));
    }
    const nextRequirements = await VisaStepRequirement_1.VisaStepRequirementModel
        .find({
        visaTypeId: data.visaTypeId,
        visaStepId: data.nextStepDoc._id,
    })
        .lean();
    if (nextRequirements.length > 0) {
        await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.insertMany(nextRequirements.map((reqItem) => ({
            userId: data.userId,
            visaTypeId: data.visaTypeId,
            visaApplicationId,
            reqId: reqItem._id,
            stepId: data.nextStepDoc._id,
            stepStatusId: newStepStatusDoc._id,
            status: enums_1.visaApplicationReqStatusEnum.NOT_UPLOADED,
            value: null,
            reason: null,
        })));
    }
    return res.status(200).json({
        message: "Step approved and next step entries are done",
        nextStepStatus: newStepStatusDoc,
    });
};
exports.approveStep = approveStep;
// Reject click on step
const rejectStep = async (req, res) => {
    const { visaApplicationId } = req.params;
    if (!visaApplicationId) {
        return res.status(400).json({ error: "visaApplicationId is required." });
    }
    // Get Visa Application
    const visaApp = await VisaApplication_1.VisaApplicationModel.findById(visaApplicationId);
    if (!visaApp) {
        return res.status(404).json({ error: "Visa Application not found." });
    }
    const { currentStep, visaTypeId, userId } = visaApp;
    // 1. Get step for currentStep
    const currentStepDoc = await VisaStep_1.VisaStepModel.findOne({
        visaTypeId,
        stepNumber: currentStep,
    });
    if (!currentStepDoc) {
        return res.status(404).json({ error: "Current Step not found." });
    }
    // 3. Update stepStatus to Rejected
    const stepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findOneAndUpdate({
        visaApplicationId,
        stepId: currentStepDoc._id,
    }, {
        $set: { status: enums_1.StepStatusEnum.REJECTED },
    }, {
        new: true, // return the updated document
    });
    return res.status(200).json({
        message: "Step rejected",
        stepStatusDoc,
    });
};
exports.rejectStep = rejectStep;
// verified (requirement)
// *******Note***** (reason ko bhi null ya empty karna padega )
const markAsVerified = async (req, res) => {
    const { reqStatusId } = req.params;
    if (!reqStatusId) {
        return res.status(400).json({ error: "reqStatusId is required." });
    }
    const updatedStatus = await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.findByIdAndUpdate(reqStatusId, { $set: { status: enums_1.visaApplicationReqStatusEnum.VERIFIED } }, { new: true });
    if (!updatedStatus) {
        return res.status(404).json({ error: "Request Status not found." });
    }
    return res.status(200).json({
        message: "Request marked as Verified.",
        data: updatedStatus,
    });
};
exports.markAsVerified = markAsVerified;
// Needs Reupload (requirement) updated the trim part-Aditya!!!
const needsReupload = async (req, res) => {
    const { reqStatusId } = req.params;
    let { reason } = req.body;
    console.log(req.body);
    console.log("_________Reason________ ", reason);
    if (!reqStatusId) {
        return res.status(400).json({ error: "reqStatusId is required." });
    }
    if (typeof reason === "string") {
        reason = reason.trim() === "" ? null : reason;
    }
    else {
        reason = null;
    }
    const updatedStatus = await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.findByIdAndUpdate(reqStatusId, {
        $set: {
            status: enums_1.visaApplicationReqStatusEnum.RE_UPLOAD,
            reason: reason,
        },
    }, { new: true });
    if (!updatedStatus) {
        return res.status(404).json({ error: "Request Status not found." });
    }
    return res.status(200).json({
        message: "Marked as 'Needs Reupload'",
        data: updatedStatus,
    });
};
exports.needsReupload = needsReupload;
