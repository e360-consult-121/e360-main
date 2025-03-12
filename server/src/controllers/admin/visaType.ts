import { Request, Response, NextFunction } from 'express';
import { VisaTypeModel } from '../../models/VisaType';
import { RequirementModel } from '../../models/Requirement';
import { VisaTypeEnum } from '../../types/enums/enums';
import AppError from '../../utils/appError';
import { ObjectId } from 'mongoose';


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
        steps: [],
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
    const { visaTypeId, newStep } = req.body;

    // format of newStep taken from frontend
    // newStep={
    //     stepName:"",
    //     stepNumber:"",
    //     requirements:[]
    // }

    if (!visaTypeId || !newStep)
        throw new AppError("VisaType ID and new step are required.", 400);

    const visaType = await VisaTypeModel.findById(visaTypeId);
    if (!visaType)
        throw new AppError("VisaType not found.", 404);

    // Add the new step to the VisaType's steps array
    visaType.steps.push(newStep);

    const updatedVisaType = await visaType.save();

    if (!updatedVisaType)
        throw new AppError("new Steps not added", 500);

    res.status(200).json({
        message: 'Step added successfully.',
        updatedVisaType,
    });
};

// Controller to create a new Requirement and push it to a particular steps in VisaType
export const createRequirementAndPushToVisaType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { visaTypeId, stepNumber, requirementData } = req.body;

    // // requirement Data format taken from frontend
    // requirementData = {
    //     type: QuestionTypeEnum.IMAGE,
    //     question: "",
    //     options: [],
    //     source: DocumentSourceEnum.USER;
    // }

    if (!visaTypeId || !requirementData || !stepNumber)
        throw new AppError("VisaType ID, stepNumber and requirement data are required.", 400);

    // Is visaType Exist
    const visaType = await VisaTypeModel.findById(visaTypeId);
    if (!visaType)
        throw new AppError("VisaType not found.", 404);

    // Is step exist in visaType
    const step = visaType.steps.find((s) => s.stepNumber === stepNumber);
    if (!step)
        throw new AppError("Step not found.", 404);


    // Create the Requirement
    const newRequirement = await RequirementModel.create(requirementData);
    if (!newRequirement)
        throw new AppError("Failed to create new requirements", 501);

    // Pushing this new requirement Id to particular step in visaType
    step.requirements.push(newRequirement._id as ObjectId);

    // Save the VisaType with the new requirement
    await visaType.save();

    res.status(201).json({
        message: 'Requirement created and added to VisaType successfully.',
        requirement: newRequirement,
        visaType,
    });
};

