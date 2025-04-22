import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.get("/:visaApplicationId/getCurrentStepInfo", authenticate ,  asyncHandler(clientSideControllers.getCurrentStepInfo));
router.post("/:reqStatusId/uploadDocument", authenticate , upload.single("file"), asyncHandler(clientSideControllers.uploadDocument));
router.post("/:visaApplicationId/stepSubmit", authenticate ,  asyncHandler(clientSideControllers.stepSubmit));
router.post("/:visaApplicationId/moveToNextStep", authenticate ,  asyncHandler(clientSideControllers.moveToNextStep));
export default router;