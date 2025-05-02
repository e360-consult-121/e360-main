import { NextFunction, Request, Response } from "express"
import AppError from "../../../utils/appError";
import { dubaiPaymentModel } from "../../../extraModels/dubaiPayments";
import { createPaymentSession, stripe } from "../../../utils/paymentUtils";
import { paymentPurpose, paymentStatus } from "../../../types/enums/enums";
import Stripe from "stripe";
import { VisaApplicationStepStatusModel } from "../../../models/VisaApplicationStepStatus";


export const handleSendPaymentLink = async (req: Request, res: Response,next:NextFunction) => {
    const { stepStatusId } = req.params;
    const { amount, currency } = req.body;

    console.log("amount",amount)
    console.log("currency",currency)
    if(!stepStatusId) {
        return next(new AppError("stepStatusId is required", 400));
    }

    const paymentDocument = await dubaiPaymentModel.findOne({ stepStatusId });

    const paymentLink = await createPaymentSession(
        "Dubai Business Setup Payment",
        { stepStatusId,purpose:paymentPurpose.DUBAI_PAYMENT },
        amount,
        currency
    );

    if (paymentDocument) {
        paymentDocument.paymentLink = paymentLink;
        paymentDocument.amount = amount;
        paymentDocument.currency = currency;
        paymentDocument.status = paymentStatus.LINKSENT;
        await paymentDocument.save();
    } else {
        const newPaymentDocument = new dubaiPaymentModel({
            stepStatusId,
            amount,
            currency,
            paymentLink,
            status: paymentStatus.LINKSENT,
        });
        await newPaymentDocument.save();
    }

    res.status(200).json({
        status: "success",
        message: "Payment link sent successfully",
        data: {
            paymentLink,
        },
    });

}

export const getPaymentStepInfo = async (req: Request, res: Response,next:NextFunction) => {
    const { stepStatusId } = req.params;
    if(!stepStatusId) {
        return next(new AppError("stepStatusId is required", 400));
    }

    const paymentDocument = await dubaiPaymentModel.findOne({ stepStatusId });

    if (!paymentDocument) {
        return res.status(200).json({
            message:"Payment Link Not sent yet",
            data:null
        })
    }

    const paymentDetails = {
        amount: paymentDocument.amount,
        currency: paymentDocument.currency,
        status: paymentDocument.status,
        paymentLink: paymentDocument.paymentLink,
        invoiceUrl: paymentDocument.invoiceUrl,
    };

    return res.status(200).json({
        status: "success",
        message: "Payment details fetched successfully",
        data: paymentDetails,
    });
}


export const handleDubaiPayment = async (
    event: Stripe.Event,
    paymentIntent: Stripe.PaymentIntent
  ) => {
    const stepStatusId = paymentIntent.metadata?.stepStatusId;
    if (!stepStatusId) {
      console.error("stepStatusId missing in metadata");
      throw new Error("stepStatusId missing in metadata");
    }
    console.log("stepStatusId from metadata:", stepStatusId);
  
    // Find the Dubai payment record
    const payment = await dubaiPaymentModel.findOne({ stepStatusId });
    if (payment) {
      payment.amount = paymentIntent.amount_received / 100;
      payment.currency = paymentIntent.currency;
      payment.paymentIntentId = paymentIntent.id;
      await payment.save();
    } else {
      console.warn("No existing payment record found for stepStatus:", stepStatusId);
    }
  
    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handleDubaiPaymentSuccess(paymentIntent, payment, stepStatusId);
        break;
  
      case "payment_intent.payment_failed":
        await handleDubaiPaymentFailure(payment);
        break;
  
      default:
        console.log("Ignored event type:", event.type);
    }
  };
  
  /**
   * Handles successful Dubai payments
   */
  const handleDubaiPaymentSuccess = async (
    paymentIntent: Stripe.PaymentIntent,
    payment: any | null,
    stepStatusId: string
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
  
    // Update step status or perform other Dubai payment-specific operations
    try {
      const stepStatus = await VisaApplicationStepStatusModel.findById(stepStatusId);
      if (stepStatus) {
        // stepStatus.status = "COMPLETED";
        // stepStatus.paymentStatus = "PAID";
        // await stepStatus.save();
        
        // Add any other Dubai payment specific logic here
        console.log("Dubai payment step completed for stepStatusId:", stepStatusId);
      }
    } catch (error) {
      console.error("Error updating step status after payment:", error);
    }
  };
  
  /**
   * Handles failed Dubai payments
   */
  const handleDubaiPaymentFailure = async (payment: any | null) => {
    if (payment) {
      payment.status = paymentStatus.FAILED;
      payment.invoiceUrl = null;
      payment.paymentMethod = null;
      await payment.save();
    }
  };