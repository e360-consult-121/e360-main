import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as visaApplication from "../../../controllers/Leads/visaApplicationController"

const router = Router();

router.get("/fetchParticularVisaApplication", authenticate ,authorizeAdmin, asyncHandler(visaApplication.fetchParticularVisaApplication))

export default router;