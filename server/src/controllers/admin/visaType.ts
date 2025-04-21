import { Request, Response, NextFunction } from 'express';
import { VisaTypeModel } from '../../models/VisaType';
import { VisaStepModel } from '../../models/VisaStep';
import { VisaStepRequirementModel } from '../../models/VisaStepRequirement';
import { VisaTypeEnum } from '../../types/enums/enums';
import AppError from '../../utils/appError';
import { ObjectId } from 'mongoose';

// create visaType
export const createVisaType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    
    const {visaType} = req.body;

    console.log("visa")
    // Validate the VisaTypeEnum
    if (!Object.values(VisaTypeEnum).includes(visaType)) {
        return res.status(400).json({ message: 'Invalid visa type.' });
    }

    const newVisaType = await VisaTypeModel.create({
        visaType,
    });

    if (!newVisaType)
        throw new AppError("Failed to creat new visaType", 500);

    res.status(201).json({
        message: 'Visa type created successfully.',
        visaType: newVisaType,
    });
};

// controller to push new steps in visaType steps
export const addStepToVisaType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { visaTypeId, stepName, stepNumber, stepSource, stepType } = req.body;

    if (!visaTypeId || !stepName || stepNumber == null || !stepSource || !stepType) {
        throw new AppError("visaTypeId, stepName, stepNumber, stepSource, and stepType are required.", 400);
    }

    const visaType = await VisaTypeModel.findById(visaTypeId);
    if (!visaType) {
        throw new AppError("VisaType not found.", 404);
    }

    const newStep = await VisaStepModel.create({
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



// Controller to create a new Requirement and push it to a particular steps in VisaType
export const createRequirementAndPushToVisaType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { visaTypeId, stepNumber, requirementData } = req.body;

    if (!visaTypeId || !stepNumber || !requirementData) {
        throw new AppError("visaTypeId, stepNumber, and requirementData are required.", 400);
    }

    // 1. Check if visaType exists
    const visaType = await VisaTypeModel.findById(visaTypeId);
    if (!visaType) {
        throw new AppError("VisaType not found.", 404);
    }

    // 2. Find the visaStep using visaTypeId and stepNumber
    const visaStep = await VisaStepModel.findOne({ visaTypeId, stepNumber });
    if (!visaStep) {
        throw new AppError("Step not found for given visaType and stepNumber.", 404);
    }

    // 3. Create requirement with visaTypeId and visaStepId
    const newRequirement = await VisaStepRequirementModel.create({
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



