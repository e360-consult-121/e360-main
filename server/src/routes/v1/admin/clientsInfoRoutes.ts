import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientsInfo from "../../../controllers/admin/visaType"

const router = Router();

router.get("/fetchAllClients", authenticate ,authorizeAdmin, asyncHandler(clientsInfo.fetchAllClients))
router.get("/fetchClientVisaApplications/:userid", authenticate ,authorizeAdmin, asyncHandler(clientsInfo.fetchClientVisaApplications))
export default router;