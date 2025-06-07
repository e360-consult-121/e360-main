import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import { addArrayForStaff } from "../../../middlewares/addArrayForStaff";
import asyncHandler from "../../../utils/asyncHandler";
import * as leadControllers from "../../../controllers/Leads/leadController";


const router = Router();


router.get("/fetchAllLeads",
 authenticate , authorizeAdmin ,
// checkPermission("View-Leads"),
// addArrayForStaff("Leads"),
 asyncHandler(leadControllers.getAllLeads));


router.get("/:leadId/fetchParticularLead",
 authenticate , authorizeAdmin ,
 //  checkPermission("Read-L"),
 asyncHandler(leadControllers.getParticularLeadInfo));


router.post("/:leadId/rejectLead",
 authenticate , authorizeAdmin ,
 //  checkPermission("Write-L"),
 asyncHandler(leadControllers.rejectLead));
 

export default router;