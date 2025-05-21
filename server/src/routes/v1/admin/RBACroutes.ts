import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as rbacControllers from "../../../controllers/admin/RBAC/rbacControllers"
import * as rbacInfoControllers from "../../../controllers/admin/RBAC/infoController"

const router = Router();
router.post("/addNewRole", authenticate ,authorizeAdmin, asyncHandler(rbacControllers.addNewRole))
router.post("/addNewAdminUser", authenticate ,authorizeAdmin, asyncHandler(rbacControllers.addNewAdminUser))
router.post("/assignActionsToRole", authenticate ,authorizeAdmin, asyncHandler(rbacControllers.assignActionsToRole))
router.post("/changeRole", authenticate ,authorizeAdmin, asyncHandler(rbacControllers.changeRole))

router.get("/fetchAllFeatures", authenticate ,authorizeAdmin, asyncHandler(rbacInfoControllers.fetchAllFeatures))
router.get("/fetchAllAdminUsers", authenticate ,authorizeAdmin, asyncHandler(rbacInfoControllers.fetchAllAdminUsers))
router.get("/fetchAllRoles", authenticate ,authorizeAdmin, asyncHandler(rbacInfoControllers.fetchAllRoles))
export default router;