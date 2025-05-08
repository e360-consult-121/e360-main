import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import mongoose from "mongoose";
import { VisaApplicationStepStatusModel as stepStatusModel } from "../../models/VisaApplicationStepStatus";
import { VisaApplicationModel as visaApplicationModel } from "../../models/VisaApplication";
import { VisaStepModel as stepModel } from "../../models/VisaStep";
import { VisaStepRequirementModel as reqModel } from "../../models/VisaStepRequirement";
import { VisaApplicationReqStatusModel as reqStatusModel } from "../../models/VisaApplicationReqStatus";
import { StepStatusEnum } from "../../types/enums/enums";




export const fetchVaultDocS = async (req: Request, res: Response) => {

  type StepGroup = {
    stepNumber: number;
    documents: {
      reqId: string;
      fileName: string;
      status: string;
      uploadedAt: string;
    }[];
  };
  
  const result: {
    adminUploaded: Record<string, StepGroup>;
    userUploaded: Record<string, StepGroup>;
  } = {
    adminUploaded: {},
    userUploaded: {}
  };
  
    const { visaApplicationId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(visaApplicationId)) {
      return res.status(400).json({ success: false, message: "Invalid visaApplicationId" });
    }
  
    // Step 1: Get the visaApplication to find visaTypeId
    const visaApplication = await visaApplicationModel.findById(visaApplicationId).lean();
  
    if (!visaApplication) {
      return res.status(404).json({ success: false, message: "Visa Application not found" });
    }
  
    const visaTypeId = visaApplication.visaTypeId;
  
    // Step 2: Fetch all steps for the visaTypeId
    const steps = await stepModel.find({ visaTypeId }).lean();
  
    // Step 3: Aggregate uploaded documents grouped by stepId
    const uploadedDocs = await reqStatusModel.aggregate([
      {
        $match: {
          visaApplicationId: new mongoose.Types.ObjectId(visaApplicationId),
          value: { $ne: null }
        }
      },
      {
        $lookup: {
          from: "visasteps",
          localField: "stepId",
          foreignField: "_id",
          as: "step"
        }
      },
      { $unwind: "$step" },
      {
        $lookup: {
          from: "visasteprequirements",
          localField: "reqId",
          foreignField: "_id",
          as: "req"
        }
      },
      { $unwind: "$req" },
      {
        $project: {
          _id: 1,
          reqId: 1,
          value: 1,
          status: 1,
          uploadedAt: "$updatedAt", // no need , we didn't use timpstamp : true
          stepName: "$step.stepName",
          question : "$req.question",
          uploadedBy: {
            $cond: [
              { $eq: ["$step.stepSource", "ADMIN"] },
              "adminUploaded",
              "userUploaded"
            ]
          }
        }
      },
      {
        $group: {
          _id: { stepName: "$stepName", uploadedBy: "$uploadedBy" },
          documents: {
            $push: {
              question : "$question",
              value: "$value",
              // status: "$status",
              // uploadedAt: "$uploadedAt"
            }
          }
        }
      }
    ]);
  
    // Step 4: Structure result with all stepNames initialized
    // const result = {
    //   adminUploaded: {} as Record<string, any[]>,
    //   userUploaded: {} as Record<string, any[]>
    // };
    
    // prepare empty arrays per step
    for (const step of steps) {
      result.adminUploaded[step.stepName] = {
        stepNumber: step.stepNumber,
        documents: []
      };
      result.userUploaded[step.stepName] = {
        stepNumber: step.stepNumber,
        documents: []
      };
    }
  
    for (const docGroup of uploadedDocs) {
      const { stepName, uploadedBy } = docGroup._id;
      // Explicitly type the uploadedBy to "adminUploaded" | "userUploaded"
      if (uploadedBy === "adminUploaded" || uploadedBy === "userUploaded") {

        const uploadedByKey = uploadedBy as "adminUploaded" | "userUploaded";

        if (result[uploadedByKey][stepName]) {
          result[uploadedByKey][stepName].documents = docGroup.documents;
        }
      }
    }
  
    return res.status(200).json({
      success: true,
      result
    });
  };


  // first -->> documents (reqS ka structure)
  // second -->> vo visaApp jisme saari docS field ho 
  // third -->> kya saare steps bhejne hai ..?? (even there is no docuemnts needed )

  