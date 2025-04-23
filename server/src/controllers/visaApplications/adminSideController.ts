import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {VisaApplicationModel as visaApplicationModel} from "../../models/VisaApplication";
import {VisaStepModel as stepModel} from "../../models/VisaStep";
import {VisaApplicationStepStatusModel as stepStatusModel} from "../../models/VisaApplicationStepStatus";
import {VisaStepRequirementModel as reqModel} from "../../models/VisaStepRequirement";
import {VisaApplicationReqStatusModel as reqStatusModel} from "../../models/VisaApplicationReqStatus";
import {visaApplicationReqStatusEnum , StepStatusEnum } from "../../types/enums/enums"



// Approve click on step
export const approveStep = async (req: Request, res: Response) => {
    const { visaApplicationId } = req.params;

    if (!visaApplicationId) {
      return res.status(400).json({ error: "visaApplicationId is required." });
    }
  
    // Get Visa Application
    const visaApp = await visaApplicationModel.findById(visaApplicationId);
    if (!visaApp) {
      return res.status(404).json({ error: "Visa Application not found." });
    }
  
    const { currentStep, visaTypeId, userId } = visaApp;
  
    // 1. Get step for currentStep
    const currentStepDoc = await stepModel.findOne({
      visaTypeId,
      stepNumber: currentStep,
    });
  
    if (!currentStepDoc) {
      return res.status(404).json({ error: "Current Step not found." });
    }
  
    // 2. Mark all requirement status = VERIFIED for this step
    await reqStatusModel.updateMany(
      {
        visaApplicationId,
        stepId: currentStepDoc._id,
      },
      {
        $set: {
          status: visaApplicationReqStatusEnum.VERIFIED,
        },
      }
    );
  
    // 3. Update stepStatus to APPROVED
    const stepStatusDoc = await stepStatusModel.findOne({
      visaApplicationId,
      stepId: currentStepDoc._id,
    });
  
    if (stepStatusDoc) {
      stepStatusDoc.status = StepStatusEnum.APPROVED;
      await stepStatusDoc.save();
    }
  
    // 4. Create StepStatus doc for next step
    const nextStepDoc = await stepModel.findOne({
      visaTypeId,
      stepNumber: currentStep + 1,
    });
  
    if (!nextStepDoc) {
      return res.status(200).json({
        message: "Step approved. No next step found (probably final step).",
      });
    }

//  Now , DO *****THIS*****
const newStepStatusDoc = await stepStatusModel.create({
    userId,
    visaTypeId,
    stepId: nextStepDoc._id,
    visaApplicationId,
    status: StepStatusEnum.IN_PROGRESS,
    reqFilled: {},
  });

    // 5. Get requirements for next step
    const nextRequirements = await reqModel.find({
        visaTypeId,
        visaStepId: nextStepDoc._id,
    });

    // 6. Create reqStatus docs for next step
    const reqStatusDocs = nextRequirements.map((reqItem) => ({
        userId,
        visaTypeId,
        visaApplicationId,
        reqId: reqItem._id,
        stepId: nextStepDoc._id,
        stepStatusId : newStepStatusDoc._id,
        status: visaApplicationReqStatusEnum.NOT_UPLOADED,
        value: null,
        reason: null,
    }));

    await reqStatusModel.insertMany(reqStatusDocs);


    return res.status(200).json({
        message: "Step approved and next step entires are done",
        nextStepStatus: newStepStatusDoc,
    });
};



// Reject click on step
export const rejectStep = async (req: Request, res: Response) => {
    const { visaApplicationId } = req.params;

    if (!visaApplicationId) {
      return res.status(400).json({ error: "visaApplicationId is required." });
    }

    // Get Visa Application
    const visaApp = await visaApplicationModel.findById(visaApplicationId);
    if (!visaApp) {
      return res.status(404).json({ error: "Visa Application not found." });
    }

    const { currentStep, visaTypeId, userId } = visaApp;

    // 1. Get step for currentStep
    const currentStepDoc = await stepModel.findOne({
      visaTypeId,
      stepNumber: currentStep,
    });

    if (!currentStepDoc) {
      return res.status(404).json({ error: "Current Step not found." });
    }

  
    // 3. Update stepStatus to Rejected
    const stepStatusDoc = await stepStatusModel.findOneAndUpdate(
      {
        visaApplicationId,
        stepId: currentStepDoc._id,
      },
      {
        $set: { status: StepStatusEnum.REJECTED },
      },
      {
        new: true, // return the updated document
      }
    );

    return res.status(200).json({
      message: "Step rejected",
      stepStatusDoc,
  });

};



// verified (requirement)
// *******Note***** (reason ko bhi null ya empty karna padega )
export const markAsVerified = async (req: Request, res: Response) => {
  const { reqStatusId } = req.params;

  if (!reqStatusId) {
    return res.status(400).json({ error: "reqStatusId is required." });
  }

  const updatedStatus = await reqStatusModel.findByIdAndUpdate(
    reqStatusId,
    { $set: { status: visaApplicationReqStatusEnum.VERIFIED } },
    { new: true }
  );

  if (!updatedStatus) {
    return res.status(404).json({ error: "Request Status not found." });
  }

  return res.status(200).json({
    message: "Request marked as Verified.",
    data: updatedStatus,
  });
};



// Needs Reupload (requirement)
export const needsReupload = async (req: Request, res: Response) => {

  const { reqStatusId } = req.params;
  let { reason } = req.body;

  if (!reqStatusId) {
    return res.status(400).json({ error: "reqStatusId is required." });
  }

  // Convert empty string to null
  reason = reason.trim() === "" ? null : reason;

  const updatedStatus = await reqStatusModel.findByIdAndUpdate(
    reqStatusId,
    {
      $set: {
        status: visaApplicationReqStatusEnum.RE_UPLOAD,
        reason : reason ,
      },
    },
    { new: true }
  );

  if (!updatedStatus) {
    return res.status(404).json({ error: "Request Status not found." });
  }

  return res.status(200).json({
    message: "Marked as 'Needs Reupload'",
    data: updatedStatus,
  });
};








  
  
  