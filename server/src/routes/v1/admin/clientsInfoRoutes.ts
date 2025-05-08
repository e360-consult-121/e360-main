import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientsInfo from "../../../controllers/admin/visaType"

const router = Router();

router.get("/fetchAllClients", authenticate ,authorizeAdmin, asyncHandler(clientsInfo.fetchAllClients))
export default router;