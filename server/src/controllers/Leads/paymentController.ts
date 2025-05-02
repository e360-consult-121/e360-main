import { NextFunction, Request, Response } from "express";
import mongoose, { Schema, model, Document } from "mongoose";
import AppError from "../../utils/appError";
import {
  createPaymentLink,
  createPaymentSession,
} from "../../utils/paymentUtils";
import { LeadModel } from "../../leadModels/leadModel";
import { UserModel } from "../../models/Users";
import { PaymentModel } from "../../leadModels/paymentModel";
import { VisaApplicationModel } from "../../models/VisaApplication";

import { VisaStepModel as stepModel } from "../../models/VisaStep";
import { VisaApplicationStepStatusModel as stepStatusModel } from "../../models/VisaApplicationStepStatus";
import { VisaStepRequirementModel as reqModel } from "../../models/VisaStepRequirement";
import {VisaApplicationReqStatusModel as reqStatusModel} from "../../models/VisaApplicationReqStatus"

import {
  leadStatus,
  RoleEnum,
  AccountStatusEnum,
  VisaApplicationStatusEnum,
  StepStatusEnum , 
  visaApplicationReqStatusEnum,
  paymentPurpose
} from "../../types/enums/enums";
import { paymentStatus } from "../../types/enums/enums";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { stripe } from "../../utils/paymentUtils";
import { updateRevenueSummary } from "../../utils/revenueCalculate";
import { addToRecentUpdates } from "../../utils/addToRecentUpdates";
import { sendPaymentLinkToLead } from "../../services/emails/triggers/leads/payment/payment-link-send";
import { getServiceType } from "../../utils/leadToServiceType";
import { sendPortalAccessToClient } from "../../services/emails/triggers/leads/payment/payment-successful";
import { handleDubaiPayment } from "../visaApplications/DubaiControllers/paymentController";

// send payment link
export const sendPaymentLink = async (req: Request, res: Response) => {
  const leadId = req.params.leadId;
  const { amount, currency } = req.body;

  // 1. Validate lead existence
  const lead = await LeadModel.findById(leadId);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }


  const productName = `Visa Consultation for ${lead.fullName.first} ${lead.fullName.last}`;
  const metadata = {
    leadId: lead._id?.toString(),
    email: lead.email,
    purpose: paymentPurpose.CONSULTATION
  };

  const paymentUrl = await createPaymentSession(productName,metadata, amount, currency);



  await sendPaymentLinkToLead(lead.email,lead.fullName.first,getServiceType(lead.__t??""),paymentUrl)

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
  const payment = new PaymentModel({
    leadId: lead._id,
    name: lead.fullName.first,
    email: lead.email,
    paymentLink: paymentUrl,
    status: paymentStatus.LINKSENT,
  });

  await payment.save();

  res.status(200).json({
    success: true,
    url: paymentUrl,
    meassage: "payment link successfully sent ",
  });
};

// The stripe-signature header is automatically added by Stripe when it sends a webhook request to your server.
// You must use it to verify the webhook using your STRIPE_WEBHOOK_SECRET

export interface createUserOptions {
  name: string;
  email: string;
  role?: RoleEnum;
  UserStatus?: AccountStatusEnum;
  phone:string
  serviceType:string
}

export async function createUserFunction({
  name,
  email,
  phone,
  serviceType
}: createUserOptions): Promise<any> {
  try {
    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      return existingUser;
    }

    // 1. Generate random password
    const randomPassword = Math.random().toString(36).slice(-5); // example: 'f4g7k'

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // 3. Create user in DB
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: RoleEnum.USER,
      status: AccountStatusEnum.ACTIVE,
      phone
    });

    console.log(`User-Account created : `, user);

    
    await sendPortalAccessToClient(user.email, user.name,serviceType , randomPassword)

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
  } catch (error) {
    console.error("User creation or email failed:", error);
    throw error;
  }
}

// const VISATYPE_MAP: Record<string, string> = {
//   "250912382847462": "6803644993e23a8417963622",
//   "250901425096454": "6803644993e23a8417963623",
//   "250912364956463": "6803644993e23a8417963620", // Dominica for now later it will be updated
// };

const VISATYPE_MAP: Record<string, string> = {
  "Portugal": "6803644993e23a8417963622",
  "Dubai": "6803644993e23a8417963623",
  "Dominica": "6803644993e23a8417963620", 
  "Grenada": "6803644993e23a8417963621", 
};

// create visaApplication

interface CreateVisaApplicationOptions {
  userId: mongoose.Types.ObjectId | string;
  visaTypeId: mongoose.Types.ObjectId | string;
  leadId: mongoose.Types.ObjectId | string;
  currentStep?: number; // optional, default 1
  visaApplicationStatus?: VisaApplicationStatusEnum;
}

export async function createVisaApplication({
  userId,
  visaTypeId,
  leadId
}: CreateVisaApplicationOptions): Promise<{ visaApplicantInfo: any }> {
  try {
    
      // step : 1 
      const newApplication = await VisaApplicationModel.create({
        userId: userId ,
        leadId:leadId, 
        visaTypeId : new mongoose.Types.ObjectId(visaTypeId),
        currentStep : 1 ,
        status: VisaApplicationStatusEnum.PENDING,
      });
  
      // 2. Get the visaStep with stepNumber = 1 for this visaTypeId
      const firstStep = await stepModel.findOne({
        visaTypeId: new mongoose.Types.ObjectId(visaTypeId),
        stepNumber: 1,
      });
  
      if (!firstStep) {
        throw new Error("First visa step not found for this visa type");
      }
  
      // 3. Create a StepStatus document

      const requiredRequirements = await reqModel.find({
        visaStepId: firstStep._id,
        required: true
      });
      
      const initialReqFilled: Record<string, boolean> = {};

      requiredRequirements.forEach((req) => {
        const requirement = req as { _id: mongoose.Types.ObjectId };
        initialReqFilled[requirement._id.toString()] = false;
      });

      const stepStatusDoc = await stepStatusModel.create({
        userId: userId,
        visaTypeId: visaTypeId,
        stepId: firstStep._id,
        visaApplicationId: newApplication._id,
        status: StepStatusEnum.IN_PROGRESS,
        reqFilled: initialReqFilled, 
      });
  
      // 4. Fetch all requirements of this step
      const requirements = await reqModel.find({
        visaStepId: firstStep._id,
      });
  
          // Step 5: Create & insert reqStatus for each requirement
      const reqStatusDocs = requirements.map((req) => ({
        userId,
        visaTypeId,
        visaApplicationId: newApplication._id,
        reqId: req._id,
        stepStatusId: stepStatusDoc._id,
        status: visaApplicationReqStatusEnum.NOT_UPLOADED,
        value: null,
        reason : null , 
        stepId : firstStep._id,
      }));

      await reqStatusModel.insertMany(reqStatusDocs); 

      console.log("Visa application & step status created successfully:", newApplication._id);
      console.log("Visa application created successfully:", newApplication);
    
    return { visaApplicantInfo:newApplication }
    // console.log("Visa application created successfully:", newApplication);
  }
  catch (error) {
    console.error("Error creating visa application:", error);
    throw error;
  }
}


// // stripe webhook

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  console.log("Payment Webhook hit!");

  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    console.error("Stripe signature missing in headers");
    res.sendStatus(400);
    return;
  }

  // Verify signature and construct event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Stripe event constructed successfully");
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.sendStatus(400);
    return;
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  console.log("Payment metadata:", paymentIntent.metadata);

  // Route to appropriate handler based on payment purpose
  const purpose = paymentIntent.metadata?.purpose;

  try {
    switch (purpose) {
      case paymentPurpose.CONSULTATION:
        await handleConsultationPayment(event, paymentIntent);
        break;
      case paymentPurpose.DUBAI_PAYMENT:
        await handleDubaiPayment(event, paymentIntent);
        break;
      default:
        console.error("Unknown payment purpose:", purpose);
        // Default to consultation payment for backward compatibility
        await handleConsultationPayment(event, paymentIntent);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing payment:", error);
    // Still return 200 to prevent Stripe from retrying
    res.sendStatus(200);
  }
};

export const handleConsultationPayment = async (
  event: Stripe.Event,
  paymentIntent: Stripe.PaymentIntent
) => {
  const leadId = paymentIntent.metadata?.leadId;
  if (!leadId) {
    console.error("leadId missing in metadata");
    throw new Error("leadId missing in metadata");
  }
  console.log("leadId from metadata:", leadId);

  const lead = await LeadModel.findById(leadId);
  if (!lead) {
    console.error("Lead not found:", leadId);
    throw new Error("Lead not found");
  }
  console.log("Lead found:", lead);

  // Extract name to store in userDb
  const name = [lead?.fullName?.first, lead?.fullName?.last].filter(Boolean).join(" ");

  const payment = await PaymentModel.findOne({ leadId });
  if (payment) {
    payment.amount = paymentIntent.amount_received / 100;
    payment.currency = paymentIntent.currency;
    payment.paymentIntentId = paymentIntent.id;
    await payment.save();
  } else {
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

/**
 * Handles successful consultation payments
 */
const handleConsultationPaymentSuccess = async (
  paymentIntent: Stripe.PaymentIntent,
  payment: any | null,
  lead: any,
  name: string
) => {
  let invoiceUrl: string | null = null;
  let paymentMethod: string | null = null;

  if (paymentIntent.latest_charge) {
    try {
      const charge = await stripe.charges.retrieve(
        paymentIntent.latest_charge as string
      );
      invoiceUrl = charge.receipt_url ?? null;
      paymentMethod = charge.payment_method_details?.type ?? null;
    } catch (err) {
      console.error("Failed to retrieve charge:", err);
    }
  }

  if (payment) {
    payment.status = paymentStatus.PAID;
    payment.invoiceUrl = invoiceUrl;
    payment.paymentMethod = paymentMethod;
    await payment.save();
  }

  // Update lead status and create user account
  if (lead) {
    lead.leadStatus = leadStatus.PAYMENTDONE;
    await lead.save();

    // Extract phone number to store in userDb
    const phone = lead?.phone;
    const fullName = `${lead?.fullName?.first || ""} ${lead?.fullName?.last || ""}`.trim();
    console.log(fullName);

    const user = await createUserFunction({
      name: fullName,
      email: lead?.email || "",
      phone: phone,
      serviceType: getServiceType(lead.__t || ""),
    });

    const visaType = lead.__t?.replace("Lead", "") || "Unknown";
    const visaTypeId = VISATYPE_MAP[visaType];

    const { visaApplicantInfo } = await createVisaApplication({
      leadId: lead._id as mongoose.Types.ObjectId,
      userId: user._id,
      visaTypeId: visaTypeId,
    });

    // Function call to add visapplication recent updates Db
    try {
      const _id = visaApplicantInfo._id;
      console.log("Attempting to add to recent updates with:", name);
      await addToRecentUpdates({
        caseId: _id.toString(),
        status: "Processing",
        name,
      });
      console.log("Added to recent updates");
    } catch (error) {
      console.error("Failed to add to recent updates:", error);
    }

    // Function to update the revenue of particular visaType for dashboard analytics
    try {
      console.log(
        "Attempting to update revenue summary with:",
        visaTypeId,
        paymentIntent.amount_received / 100
      );
      await updateRevenueSummary(
        visaTypeId,
        paymentIntent.amount_received / 100
      );
      console.log("Added to revenue updates");
    } catch (error) {
      console.error("Failed to update revenue summary:", error);
    }
  }
};

/**
 * Handles failed consultation payments
 */
const handleConsultationPaymentFailure = async (payment: any | null) => {
  if (payment) {
    payment.status = paymentStatus.FAILED;
    payment.invoiceUrl = null;
    payment.paymentMethod = null;
    await payment.save();
  }
};
