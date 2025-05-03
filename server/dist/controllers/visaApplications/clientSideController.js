"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToNextStep = exports.stepSubmit = exports.submitRequirements = exports.uploadDocument = exports.getCurrentStepInfo = void 0;
const VisaApplication_1 = require("../../models/VisaApplication");
const VisaStep_1 = require("../../models/VisaStep");
const aimaModel_1 = require("../../extraModels/aimaModel");
const VisaApplicationStepStatus_1 = require("../../models/VisaApplicationStepStatus");
const VisaStepRequirement_1 = require("../../models/VisaStepRequirement");
const VisaApplicationReqStatus_1 = require("../../models/VisaApplicationReqStatus");
const enums_1 = require("../../types/enums/enums");
const exceptionUtility_1 = require("./exceptionUtility");
const VisaType_1 = require("../../models/VisaType");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const getCurrentStepInfo = async (req, res) => {
    console.log(`getCurrentStepInfo api hit`);
    const { visaApplicationId } = req.params;
    if (!visaApplicationId) {
        return res.status(400).json({ error: "visaApplicationId is required" });
    }
    // Fetch the visa application to get visaTypeId and currentStep
    const visaApplication = await VisaApplication_1.VisaApplicationModel.findById(visaApplicationId);
    if (!visaApplication) {
        return res.status(404).json({ error: "Visa Application not found" });
    }
    const { visaTypeId, currentStep } = visaApplication;
    // fetch visaTypeName from visaTypeDoc
    const visaType = await VisaType_1.VisaTypeModel.findById(visaTypeId);
    const visaTypeName = visaType?.visaType || "Unknown";
    const allSteps = await VisaStep_1.VisaStepModel.find({ visaTypeId }).sort({ stepNumber: 1 }); // sort by step order
    const stepNames = allSteps.map((step) => step.stepName);
    // Get total steps for this visaType
    const totalSteps = await VisaStep_1.VisaStepModel.countDocuments({ visaTypeId });
    // Get the current step based on visaTypeId and currentStep
    const step = await VisaStep_1.VisaStepModel.findOne({ visaTypeId, stepNumber: currentStep });
    if (!step) {
        return res
            .status(404)
            .json({ error: "Step not found for this visa type and step number" });
    }
    const currentStepName = step.stepName;
    // prepare the common  things needed
    const commonInfo = {
        visaTypeName,
        currentStepName,
        totalSteps,
        currentStepNumber: currentStep,
        stepNames,
        stepType: step.stepType,
    };
    const { stepType } = step;
    const visaStepId = step._id;
    console.log(visaApplicationId, visaStepId);
    // Get the dynamic step status
    const stepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findOne({
        visaApplicationId,
        stepId: visaStepId,
    });
    // Get static requirements of the step
    const requirements = await VisaStepRequirement_1.VisaStepRequirementModel.find({ visaStepId: visaStepId });
    // console.log("Fetched requirements:", requirements);
    // Get dynamic requirement statuses
    const reqStatusList = await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.find({
        visaApplicationId,
        stepId: visaStepId,
    });
    // ***reqList empty aa gayi *****
    // handle here ...
    // handle when domiGrena
    const stepStatusId = stepStatusDoc?._id;
    // We have to handle this condition differently 
    if (!stepStatusId) {
        return res.status(400).json({ message: "Missing stepStatusId." });
    }
    if (stepType == enums_1.StepTypeEnum.DGINVESTMENT) {
        const response = await (0, exceptionUtility_1.getDgInvestmentStepResponse)({ stepStatusId });
        // directly return this response
        return res.status(response.statusCode).json({
            response,
            commonInfo,
            stepData: {
                stepType: step.stepType,
                currentStepStatusId: stepStatusId,
                stepStatus: stepStatusDoc?.status || "IN_PROGRESS",
                stepSource: step.stepSource,
                dgInvestmentData: response.dgInvestmentData,
            },
        });
    }
    // Handle AIMA Case
    if (stepType === enums_1.StepTypeEnum.AIMA) {
        console.log("StepstatusId", stepStatusId);
        const aimaDocs = await aimaModel_1.aimaModel.find({
            stepStatusId: new mongoose_1.default.Types.ObjectId(stepStatusId),
        });
        return res.status(200).json({
            message: "AIMA documents fetched successfully",
            commonInfo,
            stepData: {
                stepType: step.stepType,
                stepStatus: stepStatusDoc?.status || "IN_PROGRESS",
                aimaDocs,
                stepSource: step.stepSource,
            },
        });
    }
    // Create a map for quick access
    const reqStatusMap = new Map();
    // reqId : reqStatus
    reqStatusList.forEach((status) => {
        reqStatusMap.set(status.reqId.toString(), status);
    });
    // function for building response of a particular requirement...
    const formattedRequirements = requirements.map((req) => {
        const statusDoc = reqStatusMap.get(req._id.toString());
        return {
            reqStatusId: statusDoc?._id || null,
            question: req.question,
            requirementType: req.requirementType,
            reqCategory: req.reqCategory,
            options: req.options || [],
            required: req.required,
            reqStatus: statusDoc?.status || enums_1.visaApplicationReqStatusEnum.NOT_UPLOADED,
            reason: statusDoc?.reason || null,
            value: statusDoc?.value || null,
        };
    });
    return res.status(200).json({
        commonInfo,
        stepData: {
            currentStepStatusId: stepStatusId,
            currentStepNumber: currentStep,
            stepType: step.stepType,
            stepSource: step.stepSource,
            stepStatus: stepStatusDoc?.status || "IN_PROGRESS",
            requirements: formattedRequirements,
        },
    });
};
exports.getCurrentStepInfo = getCurrentStepInfo;
// upload document
const uploadDocument = async (req, res) => {
    const { reqStatusId } = req.params;
    if (!reqStatusId || reqStatusId === "null" || reqStatusId === "undefined") {
        res.status(400).json({ error: "Requirement Status ID is required." });
        return;
    }
    // Check if file or value is present
    const file = req.file;
    const { value } = req.body;
    if (!file && !value) {
        res.status(400).json({ error: "Either a file or value must be provided." });
        return;
    }
    // Find the reqStatusDoc
    const reqStatusDoc = await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.findById(reqStatusId);
    if (!reqStatusDoc) {
        res.status(404).json({ error: "Requirement status not found." });
        return;
    }
    // 🔐 Authorization check based on stepSource
    const step = await VisaStep_1.VisaStepModel.findById(reqStatusDoc.stepId);
    if (!step) {
        return res.status(500).json({ error: "Associated step not found." });
    }
    const stepSource = step.stepSource;
    if ((stepSource === enums_1.DocumentSourceEnum.USER && !req.user) ||
        (stepSource === enums_1.DocumentSourceEnum.ADMIN && !req.admin)) {
        return res.status(403).json({
            error: "You are not authorized to upload document for this step.",
        });
    }
    // If a file is uploaded, save S3 URL
    if (file) {
        reqStatusDoc.value = file.location; // S3 URL
        console.log(`reqStatus update ho gaya :`, reqStatusDoc.value);
    }
    else {
        reqStatusDoc.value = value;
    }
    reqStatusDoc.status = enums_1.visaApplicationReqStatusEnum.UPLOADED;
    reqStatusDoc.reason = null; // Optional: clear previous rejection reason
    await reqStatusDoc.save();
    // also update that map
    // Fetch related requirement to check if it's "required"
    const requirement = await VisaStepRequirement_1.VisaStepRequirementModel.findById(reqStatusDoc.reqId);
    if (!requirement) {
        return res.status(500).json({ error: "Related requirement not found." });
    }
    // If required, update `reqFilled` map in step status doc
    if (requirement.required) {
        const stepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findOne({
            visaApplicationId: reqStatusDoc.visaApplicationId,
            stepId: reqStatusDoc.stepId,
        });
        if (stepStatusDoc) {
            stepStatusDoc.reqFilled.set(reqStatusDoc.reqId.toString(), true);
            await stepStatusDoc.save();
        }
    }
    res.status(200).json({
        message: "Document uploaded successfully.",
        updatedStatus: reqStatusDoc,
    });
    return;
};
exports.uploadDocument = uploadDocument;
const submitRequirements = async (req, res) => {
    const { requirements } = req.body;
    if (!requirements ||
        !Array.isArray(requirements) ||
        requirements.length === 0) {
        return res
            .status(400)
            .json({ error: "Requirements array is required and must not be empty." });
    }
    const updateResults = [];
    const errors = [];
    for (const requirement of requirements) {
        try {
            const { reqStatusId, value } = requirement;
            if (!reqStatusId) {
                errors.push(`Missing reqStatusId for: ${JSON.stringify(requirement)}`);
                continue;
            }
            if (value === undefined) {
                errors.push(`Missing value for requirement with ID: ${reqStatusId}`);
                continue;
            }
            const reqStatusDoc = await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.findById(reqStatusId);
            if (!reqStatusDoc) {
                errors.push(`Requirement status not found for ID: ${reqStatusId}`);
                continue;
            }
            const step = await VisaStep_1.VisaStepModel.findById(reqStatusDoc.stepId);
            if (!step) {
                errors.push(`Associated step not found for requirement: ${reqStatusId}`);
                continue;
            }
            const stepSource = step.stepSource;
            if ((stepSource === enums_1.DocumentSourceEnum.USER && !req.user) ||
                (stepSource === enums_1.DocumentSourceEnum.ADMIN && !req.admin)) {
                errors.push(`Not authorized to submit requirement: ${reqStatusId}`);
                continue;
            }
            reqStatusDoc.value = value;
            reqStatusDoc.status = enums_1.visaApplicationReqStatusEnum.UPLOADED;
            await reqStatusDoc.save();
            const relatedRequirement = await VisaStepRequirement_1.VisaStepRequirementModel.findById(reqStatusDoc.reqId);
            if (!relatedRequirement) {
                errors.push(`Related requirement not found for ID: ${reqStatusId}`);
                continue;
            }
            if (relatedRequirement.required) {
                const stepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findOne({
                    visaApplicationId: reqStatusDoc.visaApplicationId,
                    stepId: reqStatusDoc.stepId,
                });
                if (stepStatusDoc) {
                    stepStatusDoc.reqFilled.set(reqStatusDoc.reqId.toString(), true);
                    await stepStatusDoc.save();
                }
            }
            updateResults.push({
                reqStatusId,
                success: true,
                message: "Requirement submitted successfully",
            });
        }
        catch (err) {
            console.error(`Error processing requirement: ${JSON.stringify(requirement)}`, err);
            errors.push(`Unhandled error for reqStatusId ${requirement?.reqStatusId || 'unknown'}`);
        }
    }
    return res.status(200).json({
        message: "Requirements processing completed",
        processed: requirements.length,
        successful: updateResults.length,
        failed: errors.length,
        results: updateResults,
        errors: errors.length > 0 ? errors : undefined,
    });
};
exports.submitRequirements = submitRequirements;
// submit step
const stepSubmit = async (req, res) => {
    const { visaApplicationId } = req.params;
    if (!visaApplicationId) {
        return res.status(400).json({ error: "visaApplicationId is required." });
    }
    console.log("visaApplicationId", visaApplicationId);
    const appData = await VisaApplication_1.VisaApplicationModel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(visaApplicationId) } },
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
                from: "visaapplicationstepstatuses",
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
            },
        },
    ]);
    if (!appData.length) {
        return res
            .status(404)
            .json({ error: "Visa Application or related data not found." });
    }
    const data = appData[0];
    const reqFilledObj = data.currentStepStatusDoc.reqFilled instanceof Map
        ? Object.fromEntries(data.currentStepStatusDoc.reqFilled)
        : data.currentStepStatusDoc.reqFilled;
    const allFilled = Object.values(reqFilledObj).every((val) => val === true);
    if (!allFilled) {
        return res.status(400).json({
            error: "Cannot submit step. All required requirements must be uploaded.",
        });
    }
    await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findByIdAndUpdate(data.currentStepStatusDoc._id, {
        $set: { status: enums_1.StepStatusEnum.SUBMITTED },
    });
    const updatedStepStatus = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.findById(data.currentStepStatusDoc._id);
    if (data.currentStepDoc.emailTriggers) {
        await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
            triggers: data.currentStepDoc.emailTriggers,
            stepStatus: enums_1.StepStatusEnum.SUBMITTED,
            visaType: data.visaType.visaType,
            email: data.user.email,
            firstName: data.user.name,
        });
    }
    return res.status(200).json({
        message: "Step submitted successfully.",
        updatedStepStatus: updatedStepStatus,
    });
};
exports.stepSubmit = stepSubmit;
// continue (from user-side)
const moveToNextStep = async (req, res) => {
    const { visaApplicationId } = req.params;
    if (!visaApplicationId) {
        return res.status(400).json({ error: "visaApplicationId is required." });
    }
    const visaApp = await VisaApplication_1.VisaApplicationModel.findById(visaApplicationId);
    if (!visaApp) {
        return res.status(404).json({ error: "Visa Application not found." });
    }
    visaApp.currentStep += 1;
    await visaApp.save();
    return res.status(200).json({
        message: "Moved to next step successfully.",
        updatedVisaApplication: visaApp,
    });
};
exports.moveToNextStep = moveToNextStep;
