import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {VisaApplicationModel as visaApplicationModel} from "../../models/VisaApplication";
import {VisaStepModel as stepModel} from "../../models/VisaStep";
import {VisaApplicationStepStatusModel as stepStatusModel} from "../../models/VisaApplicationStepStatus";
import {VisaStepRequirementModel as reqModel} from "../../models/VisaStepRequirement";
import {VisaApplicationReqStatusModel as reqStatusModel} from "../../models/VisaApplicationReqStatus";
import {visaApplicationReqStatusEnum , StepStatusEnum ,DocumentSourceEnum } from "../../types/enums/enums"


export const getCurrentStepInfo = async (req: Request, res: Response) => {
  console.log(`getCurrentStepInfo api hit`);
    const { visaApplicationId } = req.params;
  
    if (!visaApplicationId) {
      return res.status(400).json({ error: "visaApplicationId is required" });
    }
  
    // Fetch the visa application to get visaTypeId and currentStep
    const visaApplication = await visaApplicationModel.findById(visaApplicationId);
    if (!visaApplication) {
      return res.status(404).json({ error: "Visa Application not found" });
    }
  
    const { visaTypeId, currentStep } = visaApplication;

  // Get total steps for this visaType
  const totalSteps = await stepModel.countDocuments({ visaTypeId });
  
    // Get the current step based on visaTypeId and currentStep
    const step = await stepModel.findOne({ visaTypeId, stepNumber: currentStep });
    if (!step) {
      return res.status(404).json({ error: "Step not found for this visa type and step number" });
    }
  
    const visaStepId = step._id;
  
    // Get the dynamic step status
    const stepStatusDoc = await stepStatusModel.findOne({ visaApplicationId, stepId : visaStepId });
  
    // Get static requirements of the step
    const requirements = await reqModel.find({ visaStepId: visaStepId });

    console.log("Fetched requirements:", requirements);

  
    // Get dynamic requirement statuses
    const reqStatusList = await reqStatusModel.find({
      visaApplicationId,
      stepId: visaStepId,
    });
  
    // Create a map for quick access
    const reqStatusMap = new Map();
    // reqId : reqStatus
    reqStatusList.forEach((status) => {
      reqStatusMap.set(status.reqId.toString(), status);
    });



    // function for building response of a particular requirement...
    const formattedRequirements = requirements.map((req: any) => {
      const statusDoc = reqStatusMap.get(req._id.toString());  
      return {
        reqStatusId: statusDoc?._id || null,
        question: req.question,
        requirementType: req.requirementType,
        reqCategory: req.reqCategory,
        options: req.options || [],
        required: req.required,
        reqStatus: statusDoc?.status || visaApplicationReqStatusEnum.NOT_UPLOADED,
        reason: statusDoc?.reason || null,
        value: statusDoc?.value || null,
      };
    });



    return res.status(200).json({
      stepData: {
        totalSteps,
        currentStep,
        stepType: step.stepType,
        stepSource: step.stepSource,
        stepStatus: stepStatusDoc?.status || "IN_PROGRESS",
        requirements: formattedRequirements,
      },
    });
};





// upload document
export const uploadDocument = async (req: Request, res: Response) => {

  const { reqStatusId } = req.params;

  if (!reqStatusId) {
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
  const reqStatusDoc = await reqStatusModel.findById(reqStatusId);
  if (!reqStatusDoc) {
    res.status(404).json({ error: "Requirement status not found." });
    return ;
  }

  // 🔐 Authorization check based on stepSource
  const step = await stepModel.findById(reqStatusDoc.stepId);
  if (!step) {
    return res.status(500).json({ error: "Associated step not found." });
  }

  const stepSource = step.stepSource;

  if (
    (stepSource === DocumentSourceEnum.USER && !req.user) ||
    (stepSource === DocumentSourceEnum.ADMIN && !req.admin)
  ) {
    return res.status(403).json({
      error: "You are not authorized to upload document for this step.",
    });
  }



  // If a file is uploaded, save S3 URL
  if (file) {
    reqStatusDoc.value = (file as any).location; // S3 URL
    console.log(`reqStatus update ho gaya :`,reqStatusDoc.value );
  }
  else {
    reqStatusDoc.value = value;
  }

  reqStatusDoc.status = visaApplicationReqStatusEnum.UPLOADED;
  reqStatusDoc.reason = null; // Optional: clear previous rejection reason

  await reqStatusDoc.save();

  // also update that map 
  // Fetch related requirement to check if it's "required"
  const requirement = await reqModel.findById(reqStatusDoc.reqId);
  if (!requirement) {
    return res.status(500).json({ error: "Related requirement not found." });
  }

  // If required, update `reqFilled` map in step status doc
  if (requirement.required) {
    const stepStatusDoc = await stepStatusModel.findOne({
      visaApplicationId: reqStatusDoc.visaApplicationId,
      stepId: reqStatusDoc.stepId,
    });

    if (stepStatusDoc) {
      const reqFilled = stepStatusDoc.reqFilled || {};
      reqFilled[reqStatusDoc.reqId.toString()] = true;

      stepStatusDoc.reqFilled = reqFilled;
      await stepStatusDoc.save();
    }
  }

  res.status(200).json({
    message: "Document uploaded successfully.",
    updatedStatus: reqStatusDoc,
  });
  return ;
};






// submit step 
export const stepSubmit = async (req: Request, res: Response) => {

  const { visaApplicationId } = req.params;

  if (!visaApplicationId) {
    return res.status(400).json({ error: "visaApplicationId is required." });
  }

  // Step 1: Get visa application doc
  const visaAppDoc = await visaApplicationModel.findById(visaApplicationId);
  if (!visaAppDoc) {
    return res.status(404).json({ error: "Visa Application not found." });
  }

  const { visaTypeId, currentStep } = visaAppDoc;

  // Step 2: Get step doc (based on visaTypeId + currentStep)
  const stepDoc = await stepModel.findOne({
    visaTypeId,
    stepNumber: currentStep,
  });

  if (!stepDoc) {
    return res.status(404).json({ error: "Step not found for current step number." });
  }

  // Step 3: Get stepStatus doc
  const stepStatusDoc = await stepStatusModel.findOne({
    visaApplicationId,
    stepId: stepDoc._id,
  });

  if (!stepStatusDoc) {
    return res.status(404).json({ error: "Step status not found." });
  }

// Mapping check
  const reqFilledObj = stepStatusDoc.reqFilled instanceof Map
  ? Object.fromEntries(stepStatusDoc.reqFilled)
  : stepStatusDoc.reqFilled;


  const allFilled = Object.values(reqFilledObj).every((val) => val === true);


  if (!allFilled) {
    return res.status(400).json({
      error: "Cannot submit step. All required requirements must be uploaded.",
    });
  }

  // If everything is filled, update the step status
  stepStatusDoc.status = StepStatusEnum.SUBMITED;
  await stepStatusDoc.save();

  return res.status(200).json({
    message: "Step submitted successfully.",
    updatedStepStatus: stepStatusDoc,
  });
};



// continue (from user-side)
export const moveToNextStep = async (req: Request, res: Response) => {

  const { visaApplicationId } = req.params;

  if (!visaApplicationId) {
    return res.status(400).json({ error: "visaApplicationId is required." });
  }

  const visaApp = await visaApplicationModel.findById(visaApplicationId);
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



  
  
  