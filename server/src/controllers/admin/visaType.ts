import { Request, Response, NextFunction } from 'express';
import { VisaTypeModel } from '../../models/VisaType';
import { UserModel } from '../../models/Users';
import { VisaApplicationModel } from '../../models/VisaApplication';
import { VisaStepModel as stepModel } from '../../models/VisaStep';
import { LeadModel as leadModel } from '../../leadModels/leadModel';
import { PaymentModel as paymentModel } from '../../leadModels/paymentModel';
import { currencyConversion } from "../../services/currencyConversion/currencyConversion";
import { VisaStepRequirementModel as reqModel } from '../../models/VisaStepRequirement';
import { VisaTypeEnum , paymentStatus } from '../../types/enums/enums';
import AppError from '../../utils/appError';
import { ObjectId } from 'mongoose';
import {RoleEnum } from "../../types/enums/enums";


// API for fetchAllClients
export const fetchAllClients = async (req: Request, res: Response) => {
    const users = await UserModel.find({ role: RoleEnum.USER }).select("name email phone");
  
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const total = await VisaApplicationModel.countDocuments({ userId: user._id });
        const completed = await VisaApplicationModel.countDocuments({ userId: user._id, status: "COMPLETED" });
        const pending = await VisaApplicationModel.countDocuments({ userId: user._id, status: "PENDING" });

        const latestApplication = await VisaApplicationModel.findOne({ userId: user._id })
                                                             .sort({ createdAt: -1 }).lean();
            

          let visaTypeName = "N/A";
          let startingDate = "N/A"; 
          let caseId = "N/A";


          if (latestApplication?.visaTypeId) {
            const visaTypeDoc = await VisaTypeModel.findById(latestApplication.visaTypeId).lean();
            visaTypeName = visaTypeDoc?.visaType || "N/A";
            
          }
          if (latestApplication?.createdAt) {
            startingDate = new Date(latestApplication.createdAt).toISOString().split("T")[0]; 
          }

          if (latestApplication?.leadId) {
            const leadDoc = await leadModel.findById(latestApplication.leadId).lean();
            caseId = leadDoc?.nanoLeadId || "N/A";
          }

          // 3. Revenue Calculation
          const applications = await VisaApplicationModel.find({ userId: user._id }).select("paymentId").lean();
          const paymentIds = applications.map((app) => app.paymentId).filter(Boolean);

          // yaha currency ka bhi dekhna hoga ...
          let totalRevenue = 0;

          if (paymentIds.length > 0) {
            const payments = await paymentModel.find({
              _id: { $in: paymentIds },
              status: "PAID",
            }).select("amount currency").lean(); 

            // totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

            // Now handle by for loop
            for (const payment of payments) {
              if (!payment.amount) continue;
          
              const currency = payment.currency?.trim().toUpperCase() || "USD";
              let amountInUSD = payment.amount;
          
              if (currency !== "USD") {
                const converted = await currencyConversion(currency, "USD", payment.amount);
                if (converted === null) {
                  console.error(`Skipping payment due to failed conversion from ${currency}`);
                  continue;
                }
                amountInUSD = converted;
              }
          
              totalRevenue += amountInUSD;
            }
          }
  
        return {
          name: user.name,
          email: user.email,
          phone: user.phone,
          totalApplications: total,
          completedApplications: completed,
          pendingApplications: pending,

          caseId:caseId,  // latest application ki caseId
          lastService:visaTypeName,
          startingDate:startingDate,  

          totalRevenue,

          status:latestApplication?.status || "N/A"
        };
      })
    );
  
    res.status(200).json({
      success: true,
      message: "Clients with visa application stats fetched successfully",
      data: enrichedUsers,
    });
  };


// fetch All applications of a particular client 
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {

  const { clientId } = req.params;

  const applications = await VisaApplicationModel.find({
    userId: clientId,
  })
    .sort({ createdAt: -1 })
    .populate({ path: "userId" })
    .populate({ path: "visaTypeId", select: "visaType" })
    .exec();

  res.status(200).json({
    success: true,
    data: applications,
  });
};












































































































































// create visaType
// export const createVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {
    
//     const {visaType} = req.body;

//     console.log("visa")
//     // Validate the VisaTypeEnum
//     if (!Object.values(VisaTypeEnum).includes(visaType)) {
//         return res.status(400).json({ message: 'Invalid visa type.' });
//     }

//     const newVisaType = await VisaTypeModel.create({
//         visaType,
//     });

//     if (!newVisaType)
//         throw new AppError("Failed to creat new visaType", 500);

//     res.status(201).json({
//         message: 'Visa type created successfully.',
//         visaType: newVisaType,
//     });
// };

// // controller to push new steps in visaType steps
// export const addStepToVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {
//     const { visaTypeId, stepName, stepNumber, stepSource, stepType } = req.body;

//     if (!visaTypeId || !stepName || stepNumber == null || !stepSource || !stepType) {
//         throw new AppError("visaTypeId, stepName, stepNumber, stepSource, and stepType are required.", 400);
//     }

//     const visaType = await VisaTypeModel.findById(visaTypeId);
//     if (!visaType) {
//         throw new AppError("VisaType not found.", 404);
//     }

//     const newStep = await stepModel.create({
//         visaTypeId,
//         stepName,
//         stepNumber,
//         stepSource,
//         stepType,
//     });

//     res.status(201).json({
//         message: "Step added successfully.",
//         step: newStep,
//     });
// };



// // Controller to create a new Requirement and push it to a particular steps in VisaType
// export const createRequirementAndPushToVisaType = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<Response | void> => {
//     const { visaTypeId, stepNumber, requirementData } = req.body;

//     if (!visaTypeId || !stepNumber || !requirementData) {
//         throw new AppError("visaTypeId, stepNumber, and requirementData are required.", 400);
//     }

//     // 1. Check if visaType exists
//     const visaType = await VisaTypeModel.findById(visaTypeId);
//     if (!visaType) {
//         throw new AppError("VisaType not found.", 404);
//     }

//     // 2. Find the visaStep using visaTypeId and stepNumber
//     const visaStep = await stepModel.findOne({ visaTypeId, stepNumber });
//     if (!visaStep) {
//         throw new AppError("Step not found for given visaType and stepNumber.", 404);
//     }

//     // 3. Create requirement with visaTypeId and visaStepId
//     const newRequirement = await reqModel.create({
//         visaTypeId,
//         visaStepId: visaStep._id,
//         question: requirementData.question,
//         requirementType: requirementData.requirementType,
//         required: requirementData.required ?? true, // fallback to true
//         options: requirementData.options || [],
//     });

//     res.status(201).json({
//         message: "Requirement created successfully.",
//         requirement: newRequirement,
//     });
// };



