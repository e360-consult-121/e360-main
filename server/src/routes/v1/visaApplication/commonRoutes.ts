import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.get("/:visaApplicationId/getCurrentStepInfo", authenticate ,  asyncHandler(clientSideControllers.getCurrentStepInfo));
router.post("/submitRequirements" ,authenticate,asyncHandler(clientSideControllers.submitRequirements));
router.post("/:reqStatusId/uploadDocument", authenticate , upload.single("file"), asyncHandler(clientSideControllers.uploadDocument));
router.post("/:visaApplicationId/stepSubmit", authenticate ,  asyncHandler(clientSideControllers.stepSubmit));
router.post("/:visaApplicationId/approveStep", authenticate ,  asyncHandler(adminSideControllers.approveStep) );

// domiGrena investment API'S

// domiGrena Delivery and Shipping API'S
router.get("/:stepStatusId/fetchBothDetails", authenticate ,  asyncHandler(deliveryControllers.fetchBothDetails));

export default router;