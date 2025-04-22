import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {VisaApplicationModel} from "../../models/VisaApplication";
import {VisaStepModel as stepModel} from "../../models/VisaStep";
import {VisaApplicationStepStatusModel as stepStatusModel} from "../../models/VisaApplicationStepStatus";
import {VisaStepRequirementModel as reqModel} from "../../models/VisaStepRequirement";
import {VisaApplicationReqStatusModel as reqStatusModel} from "../../models/VisaApplicationReqStatus";
import {visaApplicationReqStatusEnum , StepStatusEnum } from "../../types/enums/enums"



// Approve click on step
export const approveStep = async (req: Request, res: Response) => {

};

// Reject click on step
export const rejectStep = async (req: Request, res: Response) => {

};



// verified (requirement)
export const markAsVerified = async (req: Request, res: Response) => {



};


// Needs Reupload (requirement)
export const needsReupload = async (req: Request, res: Response) => {



};







  
  
  