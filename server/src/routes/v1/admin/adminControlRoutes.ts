import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as clientsInfo from "../../../controllers/admin/visaType"
import * as adminControl from "../../../controllers/admin/adminControl/addClient";

import {upload} from "../../../services/s3Upload"

const router = Router();

router.post("/addNewClient",
    //  authenticate ,authorizeAdmin,
      upload.single("file") , asyncHandler(adminControl.addNewClient));
export default router;