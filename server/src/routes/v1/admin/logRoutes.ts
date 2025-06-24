import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import { addArrayForStaff } from "../../../middlewares/addArrayForStaff";
import asyncHandler from "../../../utils/asyncHandler";
import * as logControllers from "../../../controllers/logControllers/log";


const router = Router();


router.get("/fetchAllLogs",
 authenticate , authorizeAdmin ,
 asyncHandler(logControllers.fetchAllLogs));


router.get("/getParticularApplicationLogs/:visaApplicationId",
 authenticate , authorizeAdmin ,
 asyncHandler(logControllers.getParticularApplicationLogs));

 router.get("/getParticularLeadLogs/:leadId",
 authenticate , authorizeAdmin ,
 asyncHandler(logControllers.getParticularLeadLogs));

 

export default router;