"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDubaiPayment = exports.getPaymentStepInfo = exports.handleSendPaymentLink = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const dubaiPayments_1 = require("../../../extraModels/dubaiPayments");
const paymentUtils_1 = require("../../../utils/paymentUtils");
const enums_1 = require("../../../types/enums/enums");
const VisaApplicationStepStatus_1 = require("../../../models/VisaApplicationStepStatus");
const mongoose_1 = __importDefault(require("mongoose"));
const applicationTriggerSegregate_1 = require("../../../services/emails/triggers/applicationTriggerSegregate/applicationTriggerSegregate");
const handleSendPaymentLink = async (req, res, next) => {
    const { stepStatusId } = req.params;
    const { amount, currency } = req.body;
    console.log("amount", amount);
    console.log("currency", currency);
    if (!stepStatusId) {
        return next(new appError_1.default("stepStatusId is required", 400));
    }
    const paymentDocument = await dubaiPayments_1.dubaiPaymentModel.findOne({ stepStatusId });
    const paymentLink = await (0, paymentUtils_1.createPaymentSession)("Dubai Business Setup Payment", { stepStatusId, purpose: enums_1.paymentPurpose.DUBAI_PAYMENT }, amount, currency);
    if (paymentDocument) {
        paymentDocument.paymentLink = paymentLink;
        paymentDocument.amount = amount;
        paymentDocument.currency = currency;
        paymentDocument.status = enums_1.paymentStatus.LINKSENT;
        await paymentDocument.save();
    }
    else {
        const newPaymentDocument = new dubaiPayments_1.dubaiPaymentModel({
            stepStatusId,
            amount,
            currency,
            paymentLink,
            status: enums_1.paymentStatus.LINKSENT,
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
};
exports.handleSendPaymentLink = handleSendPaymentLink;
const getPaymentStepInfo = async (req, res, next) => {
    const { stepStatusId } = req.params;
    if (!stepStatusId) {
        return next(new appError_1.default("stepStatusId is required", 400));
    }
    const paymentDocument = await dubaiPayments_1.dubaiPaymentModel.findOne({ stepStatusId });
    if (!paymentDocument) {
        return res.status(200).json({
            message: "Payment Link Not sent yet",
            data: null,
        });
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
};
exports.getPaymentStepInfo = getPaymentStepInfo;
const handleDubaiPayment = async (event, paymentIntent) => {
    const stepStatusId = paymentIntent.metadata?.stepStatusId;
    if (!stepStatusId) {
        console.error("stepStatusId missing in metadata");
        throw new Error("stepStatusId missing in metadata");
    }
    console.log("stepStatusId from metadata:", stepStatusId);
    // Find the Dubai payment record
    const payment = await dubaiPayments_1.dubaiPaymentModel.findOne({ stepStatusId });
    if (payment) {
        payment.amount = paymentIntent.amount_received / 100;
        payment.currency = paymentIntent.currency;
        payment.paymentIntentId = paymentIntent.id;
        await payment.save();
    }
    else {
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
exports.handleDubaiPayment = handleDubaiPayment;
/**
 * Handles successful Dubai payments
 */
const handleDubaiPaymentSuccess = async (paymentIntent, payment, stepStatusId) => {
    let invoiceUrl = null;
    let paymentMethod = null;
    if (paymentIntent.latest_charge) {
        try {
            const charge = await paymentUtils_1.stripe.charges.retrieve(paymentIntent.latest_charge);
            invoiceUrl = charge.receipt_url ?? null;
            paymentMethod = charge.payment_method_details?.type ?? null;
        }
        catch (err) {
            console.error("Failed to retrieve charge:", err);
        }
    }
    if (payment) {
        payment.status = enums_1.paymentStatus.PAID;
        payment.invoiceUrl = invoiceUrl;
        payment.paymentMethod = paymentMethod;
        await payment.save();
    }
    // Update step status or perform other Dubai payment-specific operations
    try {
        const aggregationResult = await VisaApplicationStepStatus_1.VisaApplicationStepStatusModel.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(stepStatusId) } },
            {
                $lookup: {
                    from: "visasteps",
                    localField: "visaStepId",
                    foreignField: "_id",
                    as: "visaStep",
                },
            },
            { $unwind: "$visaStep" },
            {
                $lookup: {
                    from: "visatypes",
                    localField: "visaTypeId",
                    foreignField: "_id",
                    as: "visaType",
                },
            },
            { $unwind: "$visaType" },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    visaApplicationId: 1,
                    visaStepId: 1,
                    visaTypeId: 1,
                    userId: 1,
                    "visaStep.emailTriggers": 1,
                    "visaType.visaType": 1,
                    "user.email": 1,
                    "user.name": 1,
                },
            },
        ]).exec();
        if (!aggregationResult.length) {
            console.error("Required data not found for stepStatusId:", stepStatusId);
            throw new Error("Required data not found for stepStatusId:" + stepStatusId);
        }
        await (0, applicationTriggerSegregate_1.sendApplicationUpdateEmails)({
            triggers: aggregationResult[0].visaStep.emailTriggers,
            stepStatus: enums_1.StepStatusEnum.SUBMITTED,
            visaType: aggregationResult[0].visaType.visaType,
            email: aggregationResult[0].user.email,
            firstName: aggregationResult[0].user.name,
        });
        console.log("Dubai payment step completed for stepStatusId:", stepStatusId);
    }
    catch (error) {
        console.error("Error updating step status after payment:", error);
    }
};
/**
 * Handles failed Dubai payments
 */
const handleDubaiPaymentFailure = async (payment) => {
    if (payment) {
        payment.status = enums_1.paymentStatus.FAILED;
        payment.invoiceUrl = null;
        payment.paymentMethod = null;
        await payment.save();
    }
};
