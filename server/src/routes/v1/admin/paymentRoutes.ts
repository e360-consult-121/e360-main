import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as paymentControllers from "../../../controllers/Leads/paymentController";


const router = Router();

router.post("/:leadId/sendPaymentLink", authenticate , authorizeAdmin , asyncHandler(paymentControllers.sendPaymentLink));
// router.post("/webhook/stripe",express.raw({ type: 'application/json' }), asyncHandler(paymentControllers.handleStripeWebhook));

router.post("/:leadId/sendPaymentLink",
 authenticate , authorizeAdmin ,
 //  checkPermission("Write-L"),
 asyncHandler(paymentControllers.sendPaymentLink));

// This is for Customer -->> no need of role management
router.post("/:leadId/proceedToPayment", authenticate ,  asyncHandler(paymentControllers.proceedToPayment));
export default router;