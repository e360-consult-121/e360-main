import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";


const router = Router();

router.post("/:stepStatusId/approveStep", authenticate , authorizeAdmin , asyncHandler(adminSideControllers.approveStep) );
router.post("/:stepStatusId/rejectStep",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.rejectStep) );
router.post("/:reqStatusId/markAsVerified",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.markAsVerified) );
router.post("/:reqStatusId/needsReupload",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.needsReupload) );
export default router;