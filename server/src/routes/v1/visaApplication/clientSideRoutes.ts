import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.get("/:visaApplicationId/getCurrentStepInfo", authenticate ,  asyncHandler(clientSideControllers.getCurrentStepInfo));
router.post("/:reqStatusId/uploadDocument", authenticate , upload.single("file"), asyncHandler(clientSideControllers.uploadDocument));
router.post("/:visaApplicationId/stepSubmit", authenticate ,  asyncHandler(clientSideControllers.stepSubmit));
router.post("/:visaApplicationId/moveToNextStep", authenticate ,  asyncHandler(clientSideControllers.moveToNextStep));

// domiGrena API'S

router.post("/:stepStatusId/uploadInvoice", authenticate , upload.single("file"), asyncHandler(domiGrenaControllers.uploadInvoice));
router.post("/:stepStatusId/selectOption", authenticate ,  asyncHandler(domiGrenaControllers.selectOption));

export default router;