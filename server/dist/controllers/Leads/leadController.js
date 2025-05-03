"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLead = exports.getParticularLeadInfo = exports.getAllLeads = void 0;
const leadModel_1 = require("../../leadModels/leadModel");
const consultationModel_1 = require("../../leadModels/consultationModel");
const paymentModel_1 = require("../../leadModels/paymentModel");
const enums_1 = require("../../types/enums/enums");
// pagination lagana hai 
const getAllLeads = async (req, res) => {
    const leads = await leadModel_1.LeadModel.find();
    res.status(200).json({ leads });
};
exports.getAllLeads = getAllLeads;
// export const getParticularLeadInfo = async (req: Request, res: Response) => {
// input -->> leadId
// send lead info (Name , email, phone , appliedFor(visaType) , Case-id )
// send lead Status
// send consultationInfo -->> (consultation time (meet ka time) , status , join url)
// send payment info -->> (status , invioce , method)
// eligibility form -->> (complete lead document )
// };
const getParticularLeadInfo = async (req, res) => {
    // iske input ko caseId kar sakte hai 
    const leadId = req.params.leadId;
    if (!leadId) {
        return res.status(400).json({ message: "leadId is required" });
    }
    const lead = await leadModel_1.LeadModel.findById(leadId);
    if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
    }
    const consultation = await consultationModel_1.ConsultationModel.findOne({ leadId });
    const payment = await paymentModel_1.PaymentModel.findOne({ leadId });
    // now handel the appliedFor field -->> 
    const formIdToVisaType = {
        "250901425096454": "Dubai",
        "250912382847462": "Portugal",
        "250912364956463": "DomiGrena",
    };
    const visaType = lead.__t?.replace("Lead", "") || "Unknown";
    // const visaType = formIdToVisaType[lead.formId] || "Unknown";
    // Convert Mongoose doc to plain JS object
    const plainLead = lead.toObject();
    // Destructure base fields
    const { fullName, nationality, email, phone, additionalInfo = {} } = plainLead;
    // Clone and remove 'priority' from additionalInfo if it exists
    const { priority, ...cleanedAdditionalInfo } = additionalInfo || {};
    const response = {
        leadInfo: {
            name: `${lead.fullName.first} ${lead.fullName.last}`,
            email: lead.email,
            phone: lead.phone,
            appliedFor: visaType, // isko sahi se handle karna hai 
            createdAt: lead.createdAt,
            caseId: lead.caseId
        },
        leadStatus: lead.leadStatus,
        consultationInfo: consultation
            ? {
                consultationId: consultation._id,
                meetTime: consultation.formattedDate,
                status: consultation.status,
                joinUrl: consultation.joinUrl,
                rescheduleUrl: consultation.rescheduleUrl
            }
            : null,
        paymentInfo: payment
            ? {
                status: payment.status,
                method: payment.paymentMethod,
                invoice: payment.invoiceUrl,
            }
            : null,
        eligibilityForm: {
            fullName,
            nationality,
            email,
            phone,
            additionalInfo: cleanedAdditionalInfo,
        },
    };
    res.status(200).json({ success: true, data: response });
};
exports.getParticularLeadInfo = getParticularLeadInfo;
// reject lead
const rejectLead = async (req, res) => {
    // iske input ko bhi caseId kar sakye hai 
    const leadId = req.params.leadId;
    const { reasonOfRejection } = req.body;
    if (typeof reasonOfRejection !== 'string') {
        res.status(400);
        throw new Error("reasonOfRejection is required and must be a string");
    }
    const updatedLead = await leadModel_1.LeadModel.findByIdAndUpdate(leadId, {
        leadStatus: enums_1.leadStatus.REJECTED,
        reasonOfRejection: reasonOfRejection,
    }, { new: true });
    if (!updatedLead) {
        res.status(404);
        throw new Error("Lead not found");
    }
    res.status(200).json({ message: "Lead rejected successfully" });
};
exports.rejectLead = rejectLead;
