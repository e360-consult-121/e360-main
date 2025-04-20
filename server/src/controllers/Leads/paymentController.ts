import { NextFunction, Request, Response } from "express";
import mongoose ,  { Schema, model, Document } from "mongoose";
import AppError from "../../utils/appError";
import {
  createPaymentLink,
  createPaymentSession,
} from "../../utils/paymentUtils";
import { LeadModel } from "../../leadModels/leadModel";
import { UserModel } from "../../models/Users";
import { PaymentModel } from "../../leadModels/paymentModel";
import { VisaApplicationModel } from "../../models/VisaApplication";
import {
  leadStatus,
  RoleEnum,
  AccountStatusEnum,
  VisaApplicationStatusEnum
} from "../../types/enums/enums";
import { paymentStatus } from "../../types/enums/enums";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { stripe } from "../../utils/paymentUtils";
import { updateRevenueSummary } from "../../utils/revenueCalculate";
import { addToRecentUpdates } from "../../utils/addToRecentUpdates";

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

  // 2. Create payment link using utility function
  const paymentUrl = await createPaymentSession(leadId, amount, currency);

  // 3. Send email to the user
  const html = `
      <p>Hi ${lead.fullName.first},</p>
      <p>Please complete the payment to start your visa application:</p>
      <a href="${paymentUrl}" target="_blank">${paymentUrl}</a>
      <p>If you've already paid, please ignore this.</p>
    `;

  console.log(`this is your link for do paymentttt : ${paymentUrl}`);

  await sendEmail({
    to: lead.email,
    subject: "Complete Your Payment to start your Visa Application",
    html,
  });

  // save payemnt details in DB
  const payment = new PaymentModel({
    leadId: lead._id,
    name: lead.fullName.first,
    email: lead.email,
    paymentLink: paymentUrl,
    status: paymentStatus.LINKSENT,
  });

  await payment.save();

  res
    .status(200)
    .json({
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
}

export async function createUserFunction({
  name,
  email,
}: createUserOptions): Promise<any> {
  try {
    // 1. Generate random password
    const randomPassword = Math.random().toString(36).slice(-5); // example: 'f4g7k'

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // 3. Create user in DB
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      role: RoleEnum.USER,
      status: AccountStatusEnum.ACTIVE,
    });

    console.log(`User-Account created : `, user);

    const html = `
    <p>Hello ${name},</p>
    <p>Your account has been created.</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Password:</strong> ${randomPassword}</p>
    <p>Please change your password after login.</p>
  `;

    // 4. Send email with password (optional)
    await sendEmail({
      to: email,
      subject: "your account is created",
      html,
    });

    console.log(`User ${email} created & email sent.`);
    return user;
  } catch (error) {
    console.error("User creation or email failed:", error);
    throw error;
  }
}



const VISATYPE_MAP: Record<string, string> = {
  "250912382847462": "6803644993e23a8417963622",
  "250901425096454": "68024722baf865abe06c4553",
  "250912364956463": "67d15c5633d15e4bca96770a",
};

// create visaApplication

interface CreateVisaApplicationOptions {
  userId: mongoose.Types.ObjectId | string;
  visaTypeId: mongoose.Types.ObjectId | string;
  currentStep?: number; // optional, default 1
  visaApplicationStatus? : VisaApplicationStatusEnum;
}

export async function createVisaApplication ({
  userId,
  visaTypeId
}: CreateVisaApplicationOptions):Promise<{ visaApplicantInfo: any }> {
  try {
    const newApplication = await VisaApplicationModel.create({
      userId: userId , 
      visaTypeId : new mongoose.Types.ObjectId(visaTypeId),
      currentStep : 1 ,
      visaApplicationStatus: VisaApplicationStatusEnum.PENDING,
    })
    return { visaApplicantInfo:newApplication }
    // console.log("Visa application created successfully:", newApplication);
  } catch (error) {
    console.error("Error creating visa application:", error);
    throw error;
  }
}

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

// // stripe webhook
export const stripeWebhookHandler = async (req: Request, res: Response) => {
  console.log("payment Webhook hit!");

  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    console.error(" Stripe signature missing in headers");
    res.sendStatus(400);
    return;
  }

  // signature use karke event bana lete hai -----
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(" Stripe event constructed successfully");
  } catch (err) {
    console.error(" Webhook signature verification failed:", err);
    res.sendStatus(400);
    return;
  }

  //  PaymentIntent , leadId , sessionId
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  // console.log("so this is your PaymentIntent:", JSON.stringify(paymentIntent, null, 2));

  const leadId = paymentIntent.metadata?.leadId; // undefined
  if (!leadId) {
    console.error(" leadId missing in metadata");
    res.sendStatus(400);
    return;
  }
  console.log(" leadId from metadata:", leadId);

  // Fetch the sessionId
  // let checkoutSessionId: string | null = null;
  // try {
  //   const sessions = await stripe.checkout.sessions.list({
  //     payment_intent: paymentIntent.id,
  //   });
  //   const session = sessions.data[0];
  //   if (session) {
  //     checkoutSessionId = session.id;
  //     console.log("Checkout Session ID:", checkoutSessionId);
  //   }
  // } catch (err) {
  //   console.error("Error fetching checkout session:", err);
  //   res.sendStatus(500); // or 200 if you want Stripe not to retry
  //   return;
  // }

  const lead = await LeadModel.findById(leadId);

  if (lead) {
    console.log(`this is our lead:`, lead);
  }
  const name = [lead?.fullName?.first, lead?.fullName?.last].filter(Boolean).join(" ");

  const payment = await PaymentModel.findOne({ leadId });
  if (payment) {
    (payment.amount = paymentIntent.amount_received / 100),
      (payment.currency = paymentIntent.currency),
      (payment.paymentIntentId = paymentIntent.id),
      // payment.sessionId       =   checkoutSessionId ?? null;
      await payment.save();
  } else {
    console.warn(" No existing payment record found for lead:", leadId);
  }

  // SUCCESS case ....***......
  switch (event.type) {
    case "payment_intent.succeeded":
      {
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

        // UPDATE STATUS OF LEAD and create account
        if (lead) {
          lead.leadStatus = leadStatus.PAYMENTDONE;
          await lead.save();
          // call function to create user account
          const user = await createUserFunction({
            name: lead.fullName.first,
            email: lead.email,
          });

          const formId = lead.formId

          const visaTypeId = VISATYPE_MAP[formId];

          const {visaApplicantInfo} = await createVisaApplication ({
            userId :   user._id,
            visaTypeId : visaTypeId ,
          });
          
           //Function call to add visapplication recent updates Db
         try {
          const _id = visaApplicantInfo._id; 
          console.log("Attempting to add to recent updates with:", name);
          await addToRecentUpdates({ caseId : _id.toString() ,status: "Processing", name });
          console.log("Added to recent updates");
          } catch (error) {
          console.error("Failed to add to recent updates:", error);
          }

          // Function to update the revenue of particular visaType for dashboard analytics 
          try {
            console.log("Attempting to update revenue summary with:", visaTypeId, paymentIntent.amount_received / 100);
            await updateRevenueSummary(visaTypeId, paymentIntent.amount_received / 100);
            console.log("Added to revenue updates");
          } catch (error) {
            console.error("Failed to update revenue summary:", error);
          }
        }
        
       
        
      }
      break;

    case "payment_intent.payment_failed":
      {
        if (payment) {
          payment.status = paymentStatus.FAILED;
          payment.invoiceUrl = null;
          payment.paymentMethod = null;
          await payment.save();
        }

        // UPDATE STATUS OF LEAD
        // if(lead){
        //   lead.leadStatus = leadStatus.PAYMENTDONE;
        //   await lead.save();
        // }
      }
      break;

    default:
      console.log(" Ignored event type:", event.type);
  }

  res.sendStatus(200);
  return;
};

// Note: (webhook-secret -->> used in webhook ) milta hai jab tu webhook create karta hai Stripe dashboard me.

//  2 Types of Integration:
// PaymentIntent (Custom UI / card input on your site)
// Checkout Session (Stripe hosted page — easier & secure)
// payment link create ✅ Tu ye use karega

//  Publishable Key — for frontend (not needed in your case now)
//  Secret Key — for backend integration

// we can fetch invoice  like this -->>
// const invoice = await stripe.invoices.retrieve('in_1ABCDE12345');
