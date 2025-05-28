import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as leadControllers from "../../../controllers/Leads/leadController";


const router = Router();

router.get("/fetchAllLeads",
 authenticate , authorizeAdmin ,
//  checkPermission(View All Leads),
 asyncHandler(leadControllers.getAllLeads));


router.get("/:leadId/fetchParticularLead",
 authenticate , authorizeAdmin ,
 
 asyncHandler(leadControllers.getParticularLeadInfo));


router.post("/:leadId/rejectLead",
 authenticate , authorizeAdmin ,
 //  checkPermission(Reject lead),
 asyncHandler(leadControllers.rejectLead));
export default router;