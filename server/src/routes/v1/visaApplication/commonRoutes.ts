import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import * as adminSideControllers from "../../../controllers/visaApplications/adminSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import * as moaControllers from "../../../controllers/visaApplications/DubaiControllers/moaController";
import * as tradeNameControllers from "../../../controllers/visaApplications/DubaiControllers/tradeNameController";
import * as medicalControllers from "../../../controllers/visaApplications/DubaiControllers/medicalTestController";
import * as paymentControllers from "../../../controllers/visaApplications/DubaiControllers/paymentController";
import * as docVaultControllers from "../../../controllers/visaApplications/docVaultController";
import {upload} from "../../../services/s3Upload"
import { handleEligibilityForm } from "../../../controllers/visaApplications/testingEmails"

const router = Router();

router.get("/:visaApplicationId/getCurrentStepInfo", authenticate ,  asyncHandler(clientSideControllers.getCurrentStepInfo));
router.post("/submitRequirements" ,authenticate,asyncHandler(clientSideControllers.submitRequirements));
router.post("/:reqStatusId/uploadDocument", authenticate , upload.single("file"), asyncHandler(clientSideControllers.uploadDocument));
router.post("/:visaApplicationId/stepSubmit", authenticate ,  asyncHandler(clientSideControllers.stepSubmit));
router.post("/:visaApplicationId/approveStep", authenticate ,  asyncHandler(adminSideControllers.approveStep) );
// Document Vault
router.get("/:visaApplicationId/fetchVaultDocS",authenticate ,asyncHandler(docVaultControllers.fetchVaultDocS)  )

// domiGrena Delivery and Shipping API'S
router.get("/:stepStatusId/fetchBothDetails", authenticate ,  asyncHandler(deliveryControllers.fetchBothDetails));

// Dubai - TradeName
router.get("/:stepStatusId/dubai/trade-name/fetchTradeNameInfo", authenticate ,  asyncHandler(tradeNameControllers.fetchTradeNameInfo));

// Dubai - MOA
router.get("/:stepStatusId/dubai/moa/fetchSigAndMOA", authenticate ,  asyncHandler(moaControllers.fetchSigAndMOA));

// Dubai -  Medical
router.get("/:stepStatusId/dubai/medical/fetchMedicalTestInfo", authenticate ,  asyncHandler(medicalControllers.fetchMedicalTestInfo));

// Dubai -  Payments
router.get("/:stepStatusId/dubai/payment/fetchPaymentInfo", authenticate ,  asyncHandler(paymentControllers.getPaymentStepInfo));

// Documents vault



// route for testing emails 
router.post('/eligibility-form', asyncHandler(handleEligibilityForm) );



export default router;