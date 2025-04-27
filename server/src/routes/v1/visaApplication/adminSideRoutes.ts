import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import * as portugalControllers from "../../../controllers/visaApplications/portugalController";
import {upload} from "../../../services/s3Upload"

const router = Router();


router.post("/:visaApplicationId/rejectStep",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.rejectStep) );

// ye toh fir bhi only-admin ke liye chal jayega 
router.post("/:reqStatusId/markAsVerified",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.markAsVerified) );
router.post("/:reqStatusId/needsReupload",  authenticate , authorizeAdmin , asyncHandler(adminSideControllers.needsReupload) );

// domiGrena investment API'S
router.post("/:stepStatusId/addOptionsForRealState", authenticate ,authorizeAdmin ,  asyncHandler(domiGrenaControllers.addOptionsForRealState));

// domiGrena Delivery and Shipping API'S
router.post("/:stepStatusId/uploadShippingDetails", authenticate , authorizeAdmin, asyncHandler(deliveryControllers.uploadShippingDetails));
// Portugal AIMA 
router.post('/:aimaId/updateStatus' , authenticate , authorizeAdmin , asyncHandler(portugalControllers.updateStatus) );

export default router;