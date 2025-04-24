import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.post("/:visaApplicationId/approveStep", authenticate , authorizeAdmin , asyncHandler(adminSideControllers.approveStep) );
router.post("/:visaApplicationId/rejectStep",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.rejectStep) );
router.post("/:reqStatusId/markAsVerified",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.markAsVerified) );
router.post("/:reqStatusId/needsReupload",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.needsReupload) );

// domiGrena API'S

router.post("/:stepStatusId/addOptionsForRealState", authenticate ,authorizeAdmin ,  asyncHandler(domiGrenaControllers.addOptionsForRealState));

export default router;