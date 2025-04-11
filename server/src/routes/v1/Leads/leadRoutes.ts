import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as leadControllers from "../../../controllers/Leads/leadController";


const router = Router();

router.get("/fetchAllLeads", authenticate , authorizeAdmin , asyncHandler(leadControllers.getAllLeads));
router.get("/:leadId/fetchParticularLead", authenticate , authorizeAdmin , asyncHandler(leadControllers.getParticularLeadInfo));
router.post("/:leadId/rejectLead", authenticate , authorizeAdmin , asyncHandler(leadControllers.rejectLead));
export default router;