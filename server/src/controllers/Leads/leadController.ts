import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/Users";
import { LeadModel } from "../../leadModels/leadModel";
import { ConsultationModel } from "../../leadModels/consultationModel";
import { PaymentModel } from "../../leadModels/paymentModel";
import { RoleEnum ,  } from "../../types/enums/enums";
import { leadStatus } from "../../types/enums/enums";


// pagination lagana hai 
export const getAllLeads = async (req: Request, res: Response) => {
    const leads = await LeadModel.find();
    res.status(200).json({ leads });
};


// export const getParticularLeadInfo = async (req: Request, res: Response) => {
  // input -->> leadId

  // send lead info (Name , email, phone , appliedFor(visaType) , Case-id )

  // send lead Status

  // send consultationInfo -->> (consultation time (meet ka time) , status , join url)

  // send payment info -->> (status , invioce , method)

  // eligibility form -->> (complete lead document )
// };




export const getParticularLeadInfo = async (req: Request, res: Response) => {
// iske input ko caseId kar sakte hai 
  const  leadId  = req.params.leadId;

  if (!leadId) {
    return res.status(400).json({ message: "leadId is required" });
  }

  const lead = await LeadModel.findById(leadId);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  const consultation = await ConsultationModel.findOne({ leadId });
  const payment = await PaymentModel.findOne({ leadId });

    // now handel the appliedFor field -->> 
    const formIdToVisaType: Record<string, string> = {
      "250901425096454": "Dubai",
      "250912382847462": "Portugal",
      "250912364956463": "DomiGrena",
    };


    const visaType = lead.__t?.replace("Lead", "") || "Unknown";
    
    // const visaType = formIdToVisaType[lead.formId] || "Unknown";


    // Convert Mongoose doc to plain JS object
    const plainLead = lead.toObject();

    // Destructure base fields
    const {
      fullName,
      nationality,
      email,
      phone,
      additionalInfo = {}
    } = plainLead;

    // Clone and remove 'priority' from additionalInfo if it exists
    const { priority, ...cleanedAdditionalInfo } = additionalInfo || {};
  

    const response = {
      leadInfo: {
        name: `${lead.fullName.first} ${lead.fullName.last}`,
        email: lead.email,
        phone: lead.phone,
        appliedFor: visaType, // isko sahi se handle karna hai 
        createdAt : lead.createdAt,
        caseId : lead.caseId
      },

      leadStatus: lead.leadStatus,

      consultationInfo: consultation
      ? {
          consultationId: consultation._id,
          meetTime: consultation.formattedDate,
          status: consultation.status,
          joinUrl: consultation.joinUrl,
          rescheduleUrl:consultation.rescheduleUrl
        }
      : null, 

      paymentInfo: payment
      ? {
          status: payment.status,
          method: payment.paymentMethod,
          invoice: payment.invoiceUrl,
        }
      : null, 


      eligibilityForm : {
        fullName,
        nationality,
        email,
        phone,
        additionalInfo: cleanedAdditionalInfo,
      },
    };

  res.status(200).json({ success: true, data: response });
};


// reject lead
export const rejectLead = async (req: Request, res: Response) => {
// iske input ko bhi caseId kar sakye hai 
  const  leadId  = req.params.leadId;
  const { reasonOfRejection } = req.body;


  if (typeof reasonOfRejection !== 'string') {
    res.status(400);
    throw new Error("reasonOfRejection is required and must be a string");
  }

  const updatedLead = await LeadModel.findByIdAndUpdate(
    leadId,
    { 
      leadStatus: leadStatus.REJECTED,
      reasonOfRejection : reasonOfRejection,
    },
    { new: true }
  );

  if (!updatedLead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  res.status(200).json({ message: "Lead rejected successfully" });
};





