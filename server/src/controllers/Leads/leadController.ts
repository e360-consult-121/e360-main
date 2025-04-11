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

    // Generate static formatted case ID: E360-DXB-XXXX
    const prefix = "E360";
    const visaCode = "DXB"; // fixed for now
    const serial = leadId.toString().slice(-4).toUpperCase(); // get last 4 chars of ObjectId
    const caseId = `${prefix}-${visaCode}-${serial}`;


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
        appliedFor: lead.nationality, // isko sahi se handle karna hai 
        caseId,
      },

      leadStatus: lead.leadStatus,

      consultationInfo: {
        // consultationId : uidfhiwuh , // sahi karna hai isko 
        meetTime: consultation?.formattedDate || null,
        status: consultation?.status || null,
        joinUrl: consultation?.joinUrl || null,
      },

      paymentInfo: {
        status: payment?.status || null,
        method: payment?.payment_method || null,
        invoice: payment?.invoice_url || null,
      },
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

  const  leadId  = req.params.leadId;

  const updatedLead = await LeadModel.findByIdAndUpdate(
    leadId,
    { leadStatus: leadStatus.REJECTED },
    { new: true }
  );

  if (!updatedLead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  res.status(200).json({ message: "Lead rejected successfully" });
};





