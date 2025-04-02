import { Request, Response, NextFunction } from 'express';
import { VisaTypeModel } from '../../models/VisaType';
import { VisaApplicationModel } from '../../models/VisaApplication';
import { StepStatusModel } from '../../models/VisaApplicationStepStatus';
import { RequirementStatusModel } from '../../models/VisaApplicationReqStatus';
import AppError from '../../utils/appError';
import mongoose from 'mongoose';
import { Types } from "mongoose";
const { ObjectId } = Types;


export const createVisaApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const { visaTypeId } = req.body;
  const userId = req.user.id; // stringe me milegi id 

  // Validate inputs
  if (!visaTypeId) {
    return next(new AppError('Visa Type ID is required', 400));
  }

  // Fetch the visa type after populating its step's requirements
  const visaType = await VisaTypeModel.findById(visaTypeId).populate('steps.requirements');
  if (!visaType) {
    return next(new AppError('Visa Type not found', 404));
  }

  // Get the first step only
  const firstStep = visaType.steps[0];


  // Create StepStatus only for the first step only
  const firstStepStatus = await StepStatusModel.create({
    visaApplicationId: null, // Set after VisaApplication is created
    stepNumber: firstStep.stepNumber,
    stepName: firstStep.stepName,
    status: 'UNLOCKED',
    unlockedAt: new Date(),
    requirementStatus: [],
  });

  // Create VisaApplication with the first step in stepTracking
  const visaApplication = await VisaApplicationModel.create({
    userId,
    visaTypeId,
    visaApplicationstatus: 'PENDING',
    currentStep: 1,
    stepTracking: [firstStepStatus._id],
  });

  // Update StepStatus with visaApplicationId
  await StepStatusModel.findByIdAndUpdate(firstStepStatus._id, {
    visaApplicationId: visaApplication._id,
  });

  res.status(201).json({
    message: 'Visa Application created successfully',
    visaApplication,
  });
};


export const getRequirementsForCurrentStep = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { visaApplicationId } = req.params;

  // Input validation
  if (!visaApplicationId) {
    return next(new AppError('Visa Application ID is required', 400));
  }

  const result = await VisaApplicationModel.aggregate([
    // Step 1: Find Visa Application by ID
    {
      $match: { _id: new mongoose.Types.ObjectId(visaApplicationId) }
    },

    // Step 2: Lookup visaType details
    {
      $lookup: {
        from: 'visatypes',
        localField: 'visaTypeId',
        foreignField: '_id',
        as: 'visaType'
      }
    },
    { $unwind: '$visaType' },

    // Step 3: Extract current step details
    {
      $addFields: {
        currentStepDetails: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$visaType.steps',
                as: 'step',
                cond: { $eq: ['$$step.stepNumber', '$currentStep'] }
              }
            },
            0
          ]
        }
      }
    },

    // Step 4: Lookup requirements for the current step
    {
      $lookup: {
        from: 'requirements',
        localField: 'currentStepDetails.requirements',
        foreignField: '_id',
        as: 'requirements'
      }
    },

    // Step 5: Project only the requirements field
    {
      $project: {
        _id: 0,
        requirements: 1
      }
    }
  ]);

  if (!result || result.length === 0) {
    return next(new AppError('Visa Application not found', 404));
  }

  // Send the response
  res.status(200).json({
    message: 'Requirements for Current Step',
    requirements: result[0].requirements
  });
};






export const uploadDocumentForParticularReq = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { visaApplicationId, requirementId } = req.body;
  const files = req.files as Express.Multer.File[];

  // Validate input
  if (!visaApplicationId || !requirementId) {
    return next(new AppError("visaApplicationId and requirementId are required", 400));
  }

  if (!files || files.length !== 1) {
    return next(new AppError("Exactly one file must be uploaded", 400));
  }

  const fileUrl = files[0].path || "https://dummyurl.com/file"; // Replace with S3 URL later

  // Step 1: Get the currentStep and stepTracking from VisaApplication
  const visaApplication = await VisaApplicationModel.findById(visaApplicationId)
    .select("currentStep stepTracking");

  if (!visaApplication) {
    return next(new AppError("Visa application not found", 404));
  }

  if (!visaApplication.stepTracking.length) {
    return next(new AppError("No steps found for this visa application", 404));
  }

  // Step 2: Get the last StepStatus document (latest step)
  const latestStepStatusId = visaApplication.stepTracking[visaApplication.stepTracking.length - 1];

  // Step 3: Create new RequirementStatus document
  const newRequirementStatus = await RequirementStatusModel.create({
    requirement: new Types.ObjectId(requirementId),
    status: "UPLOADED",
    value: fileUrl,
  });

  // Step 4: Push the new RequirementStatus ID to the requirementStatus array of the latest StepStatus
  await StepStatusModel.updateOne(
    { _id: latestStepStatusId },
    { $push: { requirementStatus: newRequirementStatus._id } }
  );

  res.status(200).json({
    message: "Document uploaded successfully",
    fileUrl,
    requirementStatusId: newRequirementStatus._id,
  });
};





