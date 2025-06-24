import { Router } from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as visaApplication from "../../../controllers/Leads/visaApplicationController";
import { addArrayForStaff } from "../../../middlewares/addArrayForStaff";

const router = Router();

router.get(
  "/fetchApplicationsOfParticularType",
  authenticate,
  authorizeAdmin,
  checkPermission("View-VisaApplications"),
  addArrayForStaff("VisaApplications"),
  asyncHandler(visaApplication.fetchApplicationsOfParticularType)
);

router.get(
  "/fetchAllStepsOfParticularVisaType",
  authenticate,
  authorizeAdmin,
  asyncHandler(visaApplication.fetchAllStepsOfParticularVisaType)
);

router.get(
  "/getVisaApplicationInfo/:visaApplicationId",
  authenticate,
  authorizeAdmin,
  asyncHandler(visaApplication.getParticularVisaInfo)
);

export default router;
