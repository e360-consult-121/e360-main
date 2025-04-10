import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe';
import AppError from "../../utils/appError";
import { LeadModel } from "../../leadModels/leadModel";
import {PaymentModel} from "../../leadModels/paymentModel"
import { leadStatus } from "../../types/enums/enums";
import { paymentStatus } from "../../types/enums/enums"
import { sendEmail } from "../../utils/sendEmail";


// instance of Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil', // new Basil SDK version (version compatability issue aa sakte hai)
});

// send payment link
export const sendPaymentLink = async (req: Request, res: Response) => {

    const { leadId, amount } = req.body;
  
    const lead = await LeadModel.findById(leadId);
    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    // logic for creating paymentLink
    // 1. Create a product (optional — can be reused)
    const product = await stripe.products.create({
      name: `Visa Consultation for ${lead.fullName.first} ${lead.fullName.last}`,
    });
    
    // 2. Create a price for that product
    const price = await stripe.prices.create({
      unit_amount: amount * 100, // amount in paisa
      currency: "inr",
      product: product.id,
    });
    
    // 3. Create the payment link using the price ID
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id, //  this is now a string, as required
          quantity: 1,
        },
      ],
      metadata: {
        leadId: leadId,
        email: lead.email,
      },
    });

    const html = `
    <p>Hi ${lead.fullName.first},</p>
    <p>Please complete the payment to start your visa application:</p>
    <a href="${paymentLink.url}" target="_blank">${paymentLink.url}</a>
    <p>If you've already paid, please ignore this.</p>
    `;
  
    await sendEmail({
      to: lead.email,
      subject: "Complete Your Payment to start your VisaApplication",
      html,
    });
  
    res.status(200).json({ success: true, url: paymentLink.url });
};




// calendly webhook
export const stripeWebhook = async (req: Request, res: Response) => {
// logic here ...
};




// const paymentLink = await stripe.paymentLinks.create({
//   line_items: [
//     {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: `Visa Consultation for ${lead.fullName.first} ${lead.fullName.last}`,
//         },
//         unit_amount: amount * 100,  // stripe needs amount in paisa
//       },
//       quantity: 1,
//     },
//   ]as Stripe.Checkout.SessionCreateParams.LineItem[],
//   metadata: {
//     leadId: leadId,
//     email: lead.email,
//   },
// });

