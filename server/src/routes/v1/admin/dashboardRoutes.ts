import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as dashboard from "../../../controllers/Leads/dashboardController"

const router = Router();

router.get("/fetchAllRevenue", authenticate , authorizeAdmin , asyncHandler(dashboard.getAllRevenue));
router.get("/fetchRecentUpdates",authenticate , authorizeAdmin , asyncHandler(dashboard.getRecentUpdates));
router.get("/fetchRecentLeads",authenticate , authorizeAdmin , asyncHandler(dashboard.fetchRecentLeads));
router.get("/fetchRecentConsultions",authenticate , authorizeAdmin , asyncHandler(dashboard.fetchRecentConsultions));
router.get("/fetchAnalytics",authenticate , authorizeAdmin , asyncHandler(dashboard.fetchAnalytics));

export default router;