import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.post("/:visaApplicationId/moveToNextStep", authenticate ,  asyncHandler(clientSideControllers.moveToNextStep));

// domiGrena investment API'S
router.post("/:stepStatusId/uploadInvoice", authenticate , upload.single("file"), asyncHandler(domiGrenaControllers.uploadInvoice));
router.post("/:stepStatusId/selectOption", authenticate ,  asyncHandler(domiGrenaControllers.selectOption));

// domiGrena Delivery and Shipping API'S
router.post("/:stepStatusId/uploadDeliveryDetails", authenticate ,  asyncHandler(deliveryControllers.uploadDeliveryDetails));

export default router;