"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConsultationPayment = exports.stripeWebhookHandler = exports.sendPaymentLink = void 0;
exports.createUserFunction = createUserFunction;
exports.createVisaApplication = createVisaApplication;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentUtils_1 = require("../../utils/paymentUtils");
const leadModel_1 = require("../../leadModels/leadModel");
const Users_1 = require("../../models/Users");
const paymentModel_1 = require("../../leadModels/paymentModel");
const VisaApplication_1 = require("../../models/VisaApplication");
const VisaStep_1 = require("../../models/VisaStep");
const VisaApplicationStepStatus_1 = require("../../models/VisaApplicationStepStatus");
const VisaStepRequirement_1 = require("../../models/VisaStepRequirement");
const VisaApplicationReqStatus_1 = require("../../models/VisaApplicationReqStatus");
const enums_1 = require("../../types/enums/enums");
const enums_2 = require("../../types/enums/enums");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const paymentUtils_2 = require("../../utils/paymentUtils");
const revenueCalculate_1 = require("../../utils/revenueCalculate");
const addToRecentUpdates_1 = require("../../utils/addToRecentUpdates");
const payment_link_send_1 = require("../../services/emails/triggers/leads/payment/payment-link-send");
const leadToServiceType_1 = require("../../utils/leadToServiceType");
const payment_successful_1 = require("../../services/emails/triggers/leads/payment/payment-successful");
const paymentController_1 = require("../visaApplications/DubaiControllers/paymentController");
// send payment link
const sendPaymentLink = async (req, res) => {
    const leadId = req.params.leadId;
    const { amount, currency } = req.body;
    // 1. Validate lead existence
    const lead = await leadModel_1.LeadModel.findById(leadId);
    if (!lead) {
        res.status(404);
        throw new Error("Lead not found");
    }
    const productName = `Visa Consultation for ${lead.fullName.first} ${lead.fullName.last}`;
    const metadata = {
        leadId: lead._id?.toString(),
        email: lead.email,
        purpose: enums_1.paymentPurpose.CONSULTATION
    };
    const paymentUrl = await (0, paymentUtils_1.createPaymentSession)(productName, metadata, amount, currency);
    await (0, payment_link_send_1.sendPaymentLinkToLead)(lead.email, lead.fullName.first, (0, leadToServiceType_1.getServiceType)(lead.__t ?? ""), paymentUrl);
    // 3. Send email to the user
    // const html = `
    //     <p>Hi ${lead.fullName.first},</p>
    //     <p>Please complete the payment to start your visa application:</p>
    //     <a href="${paymentUrl}" target="_blank">${paymentUrl}</a>
    //     <p>If you've already paid, please ignore this.</p>
    //   `;
    // console.log(`this is your link for do paymentttt : ${paymentUrl}`);
    // await sendEmail({
    //   to: lead.email,
    //   subject: "Complete Your Payment to start your Visa Application",
    //   html,
    // });
    // save payemnt details in DB
    const payment = new paymentModel_1.PaymentModel({
        leadId: lead._id,
        name: lead.fullName.first,
        email: lead.email,
        paymentLink: paymentUrl,
        status: enums_2.paymentStatus.LINKSENT,
    });
    await payment.save();
    res.status(200).json({
        success: true,
        url: paymentUrl,
        meassage: "payment link successfully sent ",
    });
};
exports.sendPaymentLink = sendPaymentLink;
async function createUserFunction({ name, email, phone, serviceType }) {
    try {
        // 1. Check if user already exists
        const existingUser = await Users_1.UserModel.findOne({ email });
        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            return existingUser;
        }
        // 1. Generate random password
        const randomPassword = Math.random().toString(36).slice(-5); // example: 'f4g7k'
        // 2. Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
        // 3. Create user in DB
        const user = await Users_1.UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: enums_1.RoleEnum.USER,
            status: enums_1.AccountStatusEnum.ACTIVE,
            phone
        });
        console.log(`User-Account created : `, user);
        await (0, payment_successful_1.sendPortalAccessToClient)(user.email, user.name, serviceType, randomPassword);
        //   const html = `
        //   <p>Hello ${name},</p>
        //   <p>Your account has been created.</p>
        //   <p><strong>Email:</strong> ${email}</p>
        //   <p><strong>Password:</strong> ${randomPassword}</p>
        //   <p>Please change your password after login.</p>
        // `;
        // 4. Send email with password (optional)
        // await sendEmail({
        //   to: email,
        //   subject: "your account is created",
        //   html,
        // });
        console.log(`User ${email} created & email sent.`);
        return user;
    }
    catch (error) {
        console.error("User creation or email failed:", error);
        throw error;
    }
}
// const VISATYPE_MAP: Record<string, string> = {
//   "250912382847462": "6803644993e23a8417963622",
//   "250901425096454": "6803644993e23a8417963623",
//   "250912364956463": "6803644993e23a8417963620", // Dominica for now later it will be updated
// };
const VISATYPE_MAP = {
    "Portugal": "6803644993e23a8417963622",
    "Dubai": "6803644993e23a8417963623",
    "Dominica": "6803644993e23a8417963620",
    "Grenada": "6803644993e23a8417963621",
};
async function createVisaApplication({ userId, visaTypeId, leadId }) {
    try {
        // step : 1 
        const newApplication = await VisaApplication_1.VisaApplicationModel.create({
            userId: userId,
            leadId: leadId,
            visaTypeId: new mongoose_1.default.Types.ObjectId(visaTypeId),
            currentStep: 1,
            status: enums_1.VisaApplicationStatusEnum.PENDING,
        });
        // 2. Get the visaStep with stepNumber = 1 for this visaTypeId
        const firstStep = await VisaStep_1.VisaStepModel.findOne({
            visaTypeId: new mongoose_1.default.Types.ObjectId(visaTypeId),
            stepNumber: 1,
        });
        if (!firstStep) {
            throw new Error("First visa step not found for this visa type");
        }
        // 3. Create a StepStatus document
        const requiredRequirements = await VisaStepRequirement_1.VisaStepRequirementModel.find({
            visaStepId: firstStep._id,
            required: true
        });
        const initialReqFilled = {};
        requiredRequirements.forEach((req) => {
            const requirement = req;
            initialReqFilled[requirement._id.toString()] = false;
        });
        const stepStatusDoc = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.create({
            userId: userId,
            visaTypeId: visaTypeId,
            stepId: firstStep._id,
            visaApplicationId: newApplication._id,
            status: enums_1.StepStatusEnum.IN_PROGRESS,
            reqFilled: initialReqFilled,
        });
        // 4. Fetch all requirements of this step
        const requirements = await VisaStepRequirement_1.VisaStepRequirementModel.find({
            visaStepId: firstStep._id,
        });
        // Step 5: Create & insert reqStatus for each requirement
        const reqStatusDocs = requirements.map((req) => ({
            userId,
            visaTypeId,
            visaApplicationId: newApplication._id,
            reqId: req._id,
            stepStatusId: stepStatusDoc._id,
            status: enums_1.visaApplicationReqStatusEnum.NOT_UPLOADED,
            value: null,
            reason: null,
            stepId: firstStep._id,
        }));
        await VisaApplicationReqStatus_1.VisaApplicationReqStatusModel.insertMany(reqStatusDocs);
        console.log("Visa application & step status created successfully:", newApplication._id);
        console.log("Visa application created successfully:", newApplication);
        return { visaApplicantInfo: newApplication };
        // console.log("Visa application created successfully:", newApplication);
    }
    catch (error) {
        console.error("Error creating visa application:", error);
        throw error;
    }
}
// // stripe webhook
const stripeWebhookHandler = async (req, res) => {
    console.log("Payment Webhook hit!");
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        console.error("Stripe signature missing in headers");
        res.sendStatus(400);
        return;
    }
    // Verify signature and construct event
    let event;
    try {
        event = paymentUtils_2.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Stripe event constructed successfully");
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err);
        res.sendStatus(400);
        return;
    }
    const paymentIntent = event.data.object;
    console.log("Payment metadata:", paymentIntent.metadata);
    // Route to appropriate handler based on payment purpose
    const purpose = paymentIntent.metadata?.purpose;
    try {
        switch (purpose) {
            case enums_1.paymentPurpose.CONSULTATION:
                await (0, exports.handleConsultationPayment)(event, paymentIntent);
                break;
            case enums_1.paymentPurpose.DUBAI_PAYMENT:
                await (0, paymentController_1.handleDubaiPayment)(event, paymentIntent);
                break;
            default:
                console.error("Unknown payment purpose:", purpose);
                // Default to consultation payment for backward compatibility
                await (0, exports.handleConsultationPayment)(event, paymentIntent);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error processing payment:", error);
        // Still return 200 to prevent Stripe from retrying
        res.sendStatus(200);
    }
};
exports.stripeWebhookHandler = stripeWebhookHandler;
const handleConsultationPayment = async (event, paymentIntent) => {
    const leadId = paymentIntent.metadata?.leadId;
    if (!leadId) {
        console.error("leadId missing in metadata");
        throw new Error("leadId missing in metadata");
    }
    console.log("leadId from metadata:", leadId);
    const lead = await leadModel_1.LeadModel.findById(leadId);
    if (!lead) {
        console.error("Lead not found:", leadId);
        throw new Error("Lead not found");
    }
    console.log("Lead found:", lead);
    // Extract name to store in userDb
    const name = [lead?.fullName?.first, lead?.fullName?.last].filter(Boolean).join(" ");
    const payment = await paymentModel_1.PaymentModel.findOne({ leadId });
    if (payment) {
        payment.amount = paymentIntent.amount_received / 100;
        payment.currency = paymentIntent.currency;
        payment.paymentIntentId = paymentIntent.id;
        await payment.save();
    }
    else {
        console.warn("No existing payment record found for lead:", leadId);
    }
    // Handle different event types
    switch (event.type) {
        case "payment_intent.succeeded":
            await handleConsultationPaymentSuccess(paymentIntent, payment, lead, name);
            break;
        case "payment_intent.payment_failed":
            await handleConsultationPaymentFailure(payment);
            break;
        default:
            console.log("Ignored event type:", event.type);
    }
};
exports.handleConsultationPayment = handleConsultationPayment;
/**
 * Handles successful consultation payments
 */
const handleConsultationPaymentSuccess = async (paymentIntent, payment, lead, name) => {
    let invoiceUrl = null;
    let paymentMethod = null;
    if (paymentIntent.latest_charge) {
        try {
            const charge = await paymentUtils_2.stripe.charges.retrieve(paymentIntent.latest_charge);
            invoiceUrl = charge.receipt_url ?? null;
            paymentMethod = charge.payment_method_details?.type ?? null;
        }
        catch (err) {
            console.error("Failed to retrieve charge:", err);
        }
    }
    if (payment) {
        payment.status = enums_2.paymentStatus.PAID;
        payment.invoiceUrl = invoiceUrl;
        payment.paymentMethod = paymentMethod;
        await payment.save();
    }
    // Update lead status and create user account
    if (lead) {
        lead.leadStatus = enums_1.leadStatus.PAYMENTDONE;
        await lead.save();
        // Extract phone number to store in userDb
        const phone = lead?.phone;
        const fullName = `${lead?.fullName?.first || ""} ${lead?.fullName?.last || ""}`.trim();
        console.log(fullName);
        const user = await createUserFunction({
            name: fullName,
            email: lead?.email || "",
            phone: phone,
            serviceType: (0, leadToServiceType_1.getServiceType)(lead.__t || ""),
        });
        const visaType = lead.__t?.replace("Lead", "") || "Unknown";
        const visaTypeId = VISATYPE_MAP[visaType];
        const { visaApplicantInfo } = await createVisaApplication({
            leadId: lead._id,
            userId: user._id,
            visaTypeId: visaTypeId,
        });
        // Function call to add visapplication recent updates Db
        try {
            const _id = visaApplicantInfo._id;
            console.log("Attempting to add to recent updates with:", name);
            await (0, addToRecentUpdates_1.addToRecentUpdates)({
                caseId: _id.toString(),
                status: "Processing",
                name,
            });
            console.log("Added to recent updates");
        }
        catch (error) {
            console.error("Failed to add to recent updates:", error);
        }
        // Function to update the revenue of particular visaType for dashboard analytics
        try {
            console.log("Attempting to update revenue summary with:", visaTypeId, paymentIntent.amount_received / 100);
            await (0, revenueCalculate_1.updateRevenueSummary)(visaTypeId, paymentIntent.amount_received / 100);
            console.log("Added to revenue updates");
        }
        catch (error) {
            console.error("Failed to update revenue summary:", error);
        }
    }
};
/**
 * Handles failed consultation payments
 */
const handleConsultationPaymentFailure = async (payment) => {
    if (payment) {
        payment.status = enums_2.paymentStatus.FAILED;
        payment.invoiceUrl = null;
        payment.paymentMethod = null;
        await payment.save();
    }
};
