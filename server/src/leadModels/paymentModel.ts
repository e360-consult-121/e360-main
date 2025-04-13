
  

// this event will be used in stripe 
// checkout.session.completed

// stripe webhook data 
// {
//     "id": "evt_123",
//     "object": "event",
//     "data": {
//       "object": {
//         "id": "cs_test_xyz",
//         "object": "checkout.session",
//         "payment_status": "paid",
//         "customer_email": "user@example.com",
//         "amount_total": 100000,
//         "invoice": "in_1ABCDE12345", // can be fetched via Stripe API
//         "metadata": {
//           "leadId": "abc123"
//         }
//       }
//     },
//     "type": "checkout.session.completed"
//   }


// fetch invoice like this -->>
// const invoice = await stripe.invoices.retrieve('in_1ABCDE12345');


// Use success_url and cancel_url in the payment link if you switch to checkout.sessions.create for more control


// Things you need -->>
// Secret key
// Webhook secret (from Stripe dashboard)



import mongoose, { Document, Schema } from 'mongoose';
import {LeadModel } from "./leadModel";
import { paymentStatus } from "../types/enums/enums";

export interface IPayment extends Document {
  leadId: mongoose.Types.ObjectId;

  name: string;
  email: string;
  amount: number;
  currency?: string;
  payment_method?: string;

  status: paymentStatus;

  payment_link: string;
  invoice_url?: string;
  payment_intent_id: string;


}

const PaymentSchema = new Schema<IPayment>(
  {
    leadId: {
        type: Schema.Types.ObjectId,
        ref: LeadModel.modelName,
        required: true,
      },

    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String ,required: true },
    payment_method: { type: String },

    status: {
        type: String,
        enum: Object.values(paymentStatus),
        default: paymentStatus.PENDING,
      },

    payment_link: { type: String, required: true },
    invoice_url: { type: String },
    payment_intent_id: { type: String},
  },
);

export const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);


