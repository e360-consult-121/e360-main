import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientsInfo from "../../../controllers/admin/visaType"
import * as adminControl from "../../../controllers/admin/adminControl/addClient";
const router = Router();

router.get("/addNewClient", authenticate ,authorizeAdmin, asyncHandler(adminControl.addNewClient));
export default router;