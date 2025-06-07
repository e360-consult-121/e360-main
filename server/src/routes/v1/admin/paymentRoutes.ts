import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as paymentControllers from "../../../controllers/Leads/paymentController";


const router = Router();

// router.post("/webhook/stripe",express.raw({ type: 'application/json' }), asyncHandler(paymentControllers.handleStripeWebhook));

router.post("/:leadId/sendPaymentLink",
 authenticate , authorizeAdmin ,
//  checkPermission(Send Payment Link),
 asyncHandler(paymentControllers.sendPaymentLink));


router.post("/:leadId/proceedToPayment", authenticate ,  asyncHandler(paymentControllers.proceedToPayment));
export default router;