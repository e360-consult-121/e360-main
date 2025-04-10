import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as consultationControllers from "../../../controllers/Leads/consultationController";


const router = Router();

router.get("/fetchAllConsultations", authenticate , authorizeAdmin , asyncHandler(consultationControllers.getAllConsultations));
router.post("/:id/sendConsultationLink", authenticate , authorizeAdmin , asyncHandler(consultationControllers.sendConsultationLink));

router.post("/webhook/calendly", asyncHandler(consultationControllers.calendlyWebhook));
export default router;