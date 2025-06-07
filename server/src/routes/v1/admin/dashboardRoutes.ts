import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as dashboard from "../../../controllers/Leads/dashboardController"

const router = Router();

router.get("/fetchAllRevenue",
 authenticate , authorizeAdmin ,
//  checkPermission(Revenue By Location),
 asyncHandler(dashboard.getAllRevenue));

router.get("/fetchRecentUpdates",
 authenticate , authorizeAdmin ,
 //  checkPermission(Recent Data),
 asyncHandler(dashboard.getRecentUpdates));
 
router.get("/fetchRecentLeads",
authenticate , authorizeAdmin ,
 //  checkPermission(Recent Data),
asyncHandler(dashboard.fetchRecentLeads));

router.get("/fetchRecentConsultions",
authenticate , authorizeAdmin ,
 //  checkPermission(Recent Data),
asyncHandler(dashboard.fetchRecentConsultions));


router.get("/fetchAnalytics",
authenticate , authorizeAdmin ,
 //  checkPermission(Dashboard Analytics),
asyncHandler(dashboard.fetchAnalytics));

export default router;