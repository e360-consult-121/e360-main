"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveSignature = exports.fetchSigAndMOA = exports.uploadSignature = exports.moaDocumentFetch = exports.moaUpload = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const MOA_Model_1 = require("../../../extraModels/MOA_Model");
const enums_1 = require("../../../types/enums/enums");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const VisaApplicationStepStatus_1 = require("../../../models/VisaApplicationStepStatus");
// For Admin
const moaUpload = async (req, res) => {
    const { stepStatusId } = req.params;
    const file = req.file;
    if (!stepStatusId || !file) {
        throw new appError_1.default("stepStatusId and file are required.", 400);
    }
    const newMOA = await MOA_Model_1.moaModel.create({
        moaDocument: file.location, // S3 URL
        status: enums_1.moaStatusEnum.MOA_Uploaded,
        stepStatusId,
    });
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
    if (!aggregationResult.length) {
        console.error("Required data not found for stepStatusId:", stepStatusId);
        throw new Error("Required data not found for stepStatusId:" + stepStatusId);
    }
    const trigger = aggregationResult[0].visaStep.emailTriggers.filter((trigger) => trigger.templateId === "dubai-user-moa-submitted");
    await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
        triggers: [trigger],
        stepStatus: enums_1.StepStatusEnum.SUBMITTED,
        visaType: aggregationResult[0].visaType.visaType,
        email: aggregationResult[0].user.email,
        firstName: aggregationResult[0].user.name,
    });
    res.status(201).json({
        message: "MOA document uploaded and MOA record created.",
        moaStatus: newMOA.status,
    });
};
exports.moaUpload = moaUpload;
// For User
const moaDocumentFetch = async (req, res) => {
    const { stepStatusId } = req.params;
    if (!stepStatusId) {
        throw new appError_1.default("stepStatusId is required in params.", 400);
    }
    const moa = await MOA_Model_1.moaModel.findOne({ stepStatusId });
    if (!moa) {
        throw new appError_1.default("MOA not found for the given stepStatusId.", 404);
    }
    res.status(200).json({
        message: "MOA document fetched successfully.",
        moaDocument: moa.moaDocument,
        moaStatus: moa.status,
    });
};
exports.moaDocumentFetch = moaDocumentFetch;
// For User
const uploadSignature = async (req, res) => {
    const { stepStatusId } = req.params;
    const file = req.file;
    if (!stepStatusId || !file) {
        throw new appError_1.default("stepStatusId and signature file are required.", 400);
    }
    const moa = await MOA_Model_1.moaModel.findOne({ stepStatusId });
    if (!moa) {
        throw new appError_1.default("MOA not found for the given stepStatusId.", 404);
    }
    (moa.signatureFile = file.location),
        (moa.status = enums_1.moaStatusEnum.Sig_Uploaded);
    await moa.save();
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
    if (!aggregationResult.length) {
        console.error("Required data not found for stepStatusId:", stepStatusId);
        throw new Error("Required data not found for stepStatusId:" + stepStatusId);
    }
    const trigger = aggregationResult[0].visaStep.emailTriggers.filter((trigger) => trigger.templateId === "dubai-admin-signature-submitted");
    await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
        triggers: [trigger],
        stepStatus: enums_1.StepStatusEnum.SUBMITTED,
        visaType: aggregationResult[0].visaType.visaType,
        email: aggregationResult[0].user.email,
        firstName: aggregationResult[0].user.name,
    });
    res.status(200).json({
        message: "Signature uploaded successfully.",
        signatureFile: moa.signatureFile,
        moaStatus: moa.status,
    });
};
exports.uploadSignature = uploadSignature;
// For common
const fetchSigAndMOA = async (req, res) => {
    const { stepStatusId } = req.params;
    if (!stepStatusId) {
        throw new appError_1.default("stepStatusId is required in params.", 400);
    }
    const moa = await MOA_Model_1.moaModel.findOne({ stepStatusId });
    if (!moa) {
        return res.status(200).json({
            message: "MOA not uploaded yet",
            data: null,
        });
    }
    res.status(200).json({
        message: "MOA and Signature fetched successfully.",
        data: {
            moaDocument: moa.moaDocument,
            signatureFile: moa.signatureFile,
            moaStatus: moa.status,
        },
    });
};
exports.fetchSigAndMOA = fetchSigAndMOA;
// For Admin
const approveSignature = async (req, res) => {
    const { stepStatusId } = req.body;
    if (!stepStatusId) {
        throw new appError_1.default("stepStatusId is required in body.", 400);
    }
    const moa = await MOA_Model_1.moaModel.findOne({ stepStatusId });
    if (!moa) {
        throw new appError_1.default("MOA not found for the given stepStatusId.", 404);
    }
    if (!moa.signatureFile) {
        throw new appError_1.default("No signature uploaded to approve.", 400);
    }
    moa.status = enums_1.moaStatusEnum.Sig_Approved;
    await moa.save();
    res.status(200).json({
        message: "Signature approved successfully.",
        moaStatus: moa.status,
    });
};
exports.approveSignature = approveSignature;
