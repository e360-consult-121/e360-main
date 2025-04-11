// import { Router } from "express";
// import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
// import asyncHandler from "../../../utils/asyncHandler";
// import * as paymentControllers from "../../../controllers/Leads/paymentController";


// const router = Router();

// router.post("/:leadId/sendPaymentLink", authenticate , authorizeAdmin , asyncHandler(paymentControllers.sendPaymentLink));
// router.post("/webhook/stripe", asyncHandler(paymentControllers.stripeWebhook));

// export default router;