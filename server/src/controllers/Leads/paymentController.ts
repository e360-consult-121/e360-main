import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {createPaymentLink} from "../../utils/paymentUtils"
import { LeadModel } from "../../leadModels/leadModel";
import {PaymentModel} from "../../leadModels/paymentModel"
import { leadStatus } from "../../types/enums/enums";
import { paymentStatus } from "../../types/enums/enums"
import { sendEmail } from "../../utils/sendEmail";

import Stripe from 'stripe';
import { stripe } from '../../utils/paymentUtils';



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
    const paymentUrl = await createPaymentLink(leadId, amount, currency);
  
    // 3. Send email to the user
    const html = `
      <p>Hi ${lead.fullName.first},</p>
      <p>Please complete the payment to start your visa application:</p>
      <a href="${paymentUrl}" target="_blank">${paymentUrl}</a>
      <p>If you've already paid, please ignore this.</p>
    `;

    console.log(`this is your link for do paymentttt : ${paymentUrl}`);
  
    // await sendEmail({
    //   to: lead.email,
    //   subject: "Complete Your Payment to start your Visa Application",
    //   html,
    // });

    // save payemnt details in DB
    // const payment = new PaymentModel({
    //   leadId: lead._id,
    //   name: lead.fullName.first, 
    //   email: lead.email,
    //   amount,
    //   currency,
    //   payment_link: paymentUrl,
    //   status: 'PENDING', 
    // });

    // await payment.save();
  
    res.status(200).json({ success: true, url: paymentUrl , meassage : 'payment link successfully sent ' });
};



// The stripe-signature header is automatically added by Stripe when it sends a webhook request to your server.
// You must use it to verify the webhook using your STRIPE_WEBHOOK_SECRET






const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;


// // stripe webhook
export const handleStripeWebhook = async (req: Request, res: Response) => {


  console.log("payment Webhook hit!");

  // ✅ Log raw buffer data as string
  console.log("📦 Raw Stripe Webhook Body:", req.body.toString());

  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error(" Stripe signature missing in headers");
    return res.sendStatus(400);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log(" Stripe event constructed successfully:", event.type);
  } catch (err) {
    console.error(" Webhook signature verification failed:", err);
    return res.sendStatus(400);
  }

  // SUCCESS
  if (event.type === 'payment_intent.succeeded') {
    console.log(" Payment succeeded event received");

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(" PaymentIntent:", JSON.stringify(paymentIntent, null, 2));

    const leadId = paymentIntent.metadata?.leadId;
    if (!leadId) {
      console.error(" leadId missing in metadata");
      return res.sendStatus(400);
    }
    console.log(" leadId from metadata:", leadId);

    const paymentData = {
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
      status: paymentStatus.PAID,
      payment_method: (paymentIntent as any).charges?.data[0]?.payment_method_details?.type,
      invoice_url: (paymentIntent as any).charges?.data[0]?.receipt_url,
    };
    console.log(" Payment data prepared:", paymentData);

    const payment = await PaymentModel.findOne({ leadId });
    if (payment) {
      console.log(" Found existing payment, updating...");
      payment.status = paymentData.status;
      payment.payment_method = paymentData.payment_method;
      payment.invoice_url = paymentData.invoice_url;
      payment.payment_intent_id = paymentData.payment_intent_id;
      await payment.save();
      console.log(" Payment updated for lead:", leadId);
    } else {
      console.warn(" No existing payment record found for lead:", leadId);
    }
  }

  // FAILURE
  else if (event.type === 'payment_intent.payment_failed') {
    console.log(" Payment failed event received");

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(" Failed PaymentIntent:", JSON.stringify(paymentIntent, null, 2));

    const leadId = paymentIntent.metadata?.leadId;
    if (!leadId) {
      console.error(" leadId missing in metadata");
      return res.sendStatus(400);
    }
    console.log(" leadId from metadata:", leadId);

    const payment = await PaymentModel.findOne({ leadId });
    if (payment) {
      console.log(" Found payment, marking as FAILED");
      payment.status = paymentStatus.FAILED;
      payment.payment_intent_id = paymentIntent.id;
      await payment.save();
      console.log(" Payment marked as FAILED for lead:", leadId);
    } else {
      console.warn(" No payment record found to mark as failed for lead:", leadId);
    }
  } else {
    console.log(" Ignored event type:", event.type);
  }

  res.sendStatus(200);
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


