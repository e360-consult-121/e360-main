import express, { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientSideControllers from "../../../controllers/visaApplications/clientSideController";
import * as domiGrenaControllers from "../../../controllers/visaApplications/domiGrenaController";
import * as deliveryControllers from "../../../controllers/visaApplications/dgDeliveryController";
import * as tradeNameControllers from "../../../controllers/visaApplications/DubaiControllers/tradeNameController";
import * as moaControllers from "../../../controllers/visaApplications/DubaiControllers/moaController";
import {upload} from "../../../services/s3Upload"

const router = Router();

router.post("/:visaApplicationId/moveToNextStep", authenticate ,  asyncHandler(clientSideControllers.moveToNextStep));

// domiGrena investment API'S
router.post("/:stepStatusId/uploadInvoice", authenticate , upload.single("file"), asyncHandler(domiGrenaControllers.uploadInvoice));
router.post("/:stepStatusId/selectOption", authenticate ,  asyncHandler(domiGrenaControllers.selectOption));

// domiGrena Delivery and Shipping API'S
router.post("/:stepStatusId/uploadDeliveryDetails", authenticate ,  asyncHandler(deliveryControllers.uploadDeliveryDetails));


// Dubai - Trade Name
router.post('/:stepStatusId/dubai/trade-name/uploadTradeNameOptions' , authenticate ,  asyncHandler(tradeNameControllers.uploadTradeNameOptions) );
router.post('/:stepStatusId/dubai/trade-name/SendChangeRequest' , authenticate ,  asyncHandler(tradeNameControllers.SendChangeRequest) );
router.get('/:stepStatusId/dubai/trade-name/fetchAssignedTradeName' , authenticate ,  asyncHandler(tradeNameControllers.fetchAssignedTradeName) );

// Dubai - MOA
router.get('/:stepStatusId/dubai/MOA/moaDocumentFetch' , authenticate ,  asyncHandler(moaControllers.moaDocumentFetch) );
router.post('/:stepStatusId/dubai/MOA/uploadSignature' , authenticate , upload.single("file"),  asyncHandler(moaControllers.uploadSignature) );
export default router;