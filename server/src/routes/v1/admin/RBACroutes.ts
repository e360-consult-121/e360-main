import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as rbacControllers from "../../../controllers/admin/RBAC/rbacControllers"
import * as rbacInfoControllers from "../../../controllers/admin/RBAC/infoController"

const router = Router();

router.post("/addNewRole",
 authenticate ,authorizeAdmin,
//  checkPermission("Add new Role"),
 asyncHandler(rbacControllers.addNewRole));

router.post("/addNewAdminUser",
 authenticate ,authorizeAdmin,
 //  checkPermission("Add new Admin User"),
 asyncHandler(rbacControllers.addNewAdminUser));

router.post("/assignActionsToRole",
 authenticate ,authorizeAdmin,
  //  checkPermission("Assign actions to existing Role"),
 asyncHandler(rbacControllers.assignActionsToRole));

router.patch("/editAdminUser/:employeeId",
 authenticate ,authorizeAdmin,
   //  checkPermission("Edit Details of an Admin User"),
 asyncHandler(rbacControllers.editAdminUser));

 router.delete("/deleteAdminUser/:userId",
 authenticate ,authorizeAdmin,
   //  checkPermission("Delete an Admin User"),
 asyncHandler(rbacControllers.deleteAdminUser));

router.get("/fetchAllFeatures"   , authenticate , authorizeAdmin , asyncHandler(rbacInfoControllers.fetchAllFeatures));
router.get("/fetchAllAdminUsers" , authenticate , authorizeAdmin , asyncHandler(rbacInfoControllers.fetchAllAdminUsers));
router.get("/fetchAllRoles"      , authenticate , authorizeAdmin , asyncHandler(rbacInfoControllers.fetchAllRoles));
router.get("/fetchRoleWisePermissions"      , authenticate , authorizeAdmin , asyncHandler(rbacInfoControllers.fetchRoleWisePermissions));

export default router;
