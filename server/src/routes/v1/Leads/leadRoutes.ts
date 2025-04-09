import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as leadControllers from "../../../controllers/Leads/leadController";


const router = Router();

router.get("/fetchAllLeads", authenticate , authorizeAdmin , asyncHandler(leadControllers.getAllLeads));
// router.post("/add-visaType-steps", authenticate, asyncHandler(visaTypeController.addStepToVisaType));
// router.post("/create-visaType-requirement", authenticate, asyncHandler(visaTypeController.createRequirementAndPushToVisaType));



export default router;