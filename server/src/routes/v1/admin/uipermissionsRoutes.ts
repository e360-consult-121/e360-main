import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../../middlewares/authenticate";
import * as UIPermissionsController from "../../../controllers/admin/UIPermission/UiPermissionsController"
import asyncHandler from "../../../utils/asyncHandler";


const router = Router();


router.get("/fetchUIPermissions",authenticate,authorizeAdmin,asyncHandler(UIPermissionsController.FetchUIPermissions))

export default router;
