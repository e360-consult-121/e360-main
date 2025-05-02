import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import * as portugalControllers from "../../../controllers/visaApplications/portugalController";
import * as tradeNameControllers from "../../../controllers/visaApplications/DubaiControllers/tradeNameController";
import * as moaControllers from "../../../controllers/visaApplications/DubaiControllers/moaController";
import * as medicalControllers from "../../../controllers/visaApplications/DubaiControllers/medicalTestController";
import * as paymentControllers from "../../../controllers/visaApplications/DubaiControllers/paymentController";
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


// Dubai- Trade Name
router.get('/:stepStatusId/dubai/trade-name/fetchTradeNameOptions' , authenticate , authorizeAdmin , asyncHandler(tradeNameControllers.fetchTradeNameOptions) );
router.post('/:stepStatusId/dubai/trade-name/assignOneTradeName' , authenticate , authorizeAdmin , asyncHandler(tradeNameControllers.assignOneTradeName) );
router.post('/:stepStatusId/dubai/trade-name/approveChangeReq' , authenticate , authorizeAdmin , asyncHandler(tradeNameControllers.approveChangeReq) );
router.post('/:stepStatusId/dubai/trade-name/rejectChangeReq' , authenticate , authorizeAdmin , asyncHandler(tradeNameControllers.rejectChangeReq) );

// Dubai - MOA
router.post('/:stepStatusId/dubai/MOA/moaUpload' , authenticate , authorizeAdmin ,upload.single("file"), asyncHandler(moaControllers.moaUpload) );
router.post('/:stepStatusId/dubai/MOA/approveSignature' , authenticate , authorizeAdmin , asyncHandler(moaControllers.approveSignature) );

// Dubai - Medical Test
router.post("/:stepStatusId/dubai/medical/uploadMedicalTestDetails", authenticate ,  asyncHandler(medicalControllers.uploadMedicalTestDetails));
router.post("/:stepStatusId/dubai/medical/markTestAsCompleted", authenticate ,  asyncHandler(medicalControllers.markTestAsCompleted));
router.post("/:stepStatusId/dubai/medical/approveReschedulingReq", authenticate ,  asyncHandler(medicalControllers.approveReschedulingReq));
router.post("/:stepStatusId/dubai/medical/approveReschedulingReq", authenticate ,  asyncHandler(medicalControllers.approveReschedulingReq));


// Dubai - Payment
router.post("/:stepStatusId/dubai/payment/sendPaymentLink", authenticate , authorizeAdmin , asyncHandler(paymentControllers.handleSendPaymentLink));
export default router;


