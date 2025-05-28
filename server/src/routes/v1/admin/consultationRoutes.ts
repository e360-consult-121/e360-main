import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as consultationControllers from "../../../controllers/Leads/consultationController";


const router = Router();

router.get("/fetchAllConsultations",
 authenticate , authorizeAdmin ,
//  checkPermission(View All Consultations),
 asyncHandler(consultationControllers.getAllConsultations));

router.post("/:leadId/sendConsultationLink",
 authenticate , authorizeAdmin ,
//  checkPermission(Send Consultation link),
asyncHandler(consultationControllers.sendConsultationLink));

router.post("/:consultationId/markConsultationAsCompleted",
 authenticate , authorizeAdmin ,
//  checkPermission(Mark Consultation as Completed),
 asyncHandler(consultationControllers.markConsultationAsCompleted));

 
router.post("/webhook/calendly", asyncHandler(consultationControllers.calendlyWebhook));
export default router;