"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequirementAndPushToVisaType = exports.addStepToVisaType = exports.createVisaType = void 0;
const VisaType_1 = require("../../models/VisaType");
const VisaStep_1 = require("../../models/VisaStep");
const VisaStepRequirement_1 = require("../../models/VisaStepRequirement");
const enums_1 = require("../../types/enums/enums");
const appError_1 = __importDefault(require("../../utils/appError"));
// create visaType
const createVisaType = async (req, res, next) => {
    const { visaType } = req.body;
    console.log("visa");
    // Validate the VisaTypeEnum
    if (!Object.values(enums_1.VisaTypeEnum).includes(visaType)) {
        return res.status(400).json({ message: 'Invalid visa type.' });
    }
    const newVisaType = await VisaType_1.VisaTypeModel.create({
        visaType,
    });
    if (!newVisaType)
        throw new appError_1.default("Failed to creat new visaType", 500);
    res.status(201).json({
        message: 'Visa type created successfully.',
        visaType: newVisaType,
    });
};
exports.createVisaType = createVisaType;
// controller to push new steps in visaType steps
const addStepToVisaType = async (req, res, next) => {
    const { visaTypeId, stepName, stepNumber, stepSource, stepType } = req.body;
    if (!visaTypeId || !stepName || stepNumber == null || !stepSource || !stepType) {
        throw new appError_1.default("visaTypeId, stepName, stepNumber, stepSource, and stepType are required.", 400);
    }
    const visaType = await VisaType_1.VisaTypeModel.findById(visaTypeId);
    if (!visaType) {
        throw new appError_1.default("VisaType not found.", 404);
    }
    const newStep = await VisaStep_1.VisaStepModel.create({
        visaTypeId,
        stepName,
        stepNumber,
        stepSource,
        stepType,
    });
    res.status(201).json({
        message: "Step added successfully.",
        step: newStep,
    });
};
exports.addStepToVisaType = addStepToVisaType;
// Controller to create a new Requirement and push it to a particular steps in VisaType
const createRequirementAndPushToVisaType = async (req, res, next) => {
    const { visaTypeId, stepNumber, requirementData } = req.body;
    if (!visaTypeId || !stepNumber || !requirementData) {
        throw new appError_1.default("visaTypeId, stepNumber, and requirementData are required.", 400);
    }
    // 1. Check if visaType exists
    const visaType = await VisaType_1.VisaTypeModel.findById(visaTypeId);
    if (!visaType) {
        throw new appError_1.default("VisaType not found.", 404);
    }
    // 2. Find the visaStep using visaTypeId and stepNumber
    const visaStep = await VisaStep_1.VisaStepModel.findOne({ visaTypeId, stepNumber });
    if (!visaStep) {
        throw new appError_1.default("Step not found for given visaType and stepNumber.", 404);
    }
    // 3. Create requirement with visaTypeId and visaStepId
    const newRequirement = await VisaStepRequirement_1.VisaStepRequirementModel.create({
        visaTypeId,
        visaStepId: visaStep._id,
        question: requirementData.question,
        requirementType: requirementData.requirementType,
        required: requirementData.required ?? true, // fallback to true
        options: requirementData.options || [],
    });
    res.status(201).json({
        message: "Requirement created successfully.",
        requirement: newRequirement,
    });
};
exports.createRequirementAndPushToVisaType = createRequirementAndPushToVisaType;
