import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import { checkPermission } from "../../../middlewares/permissionMiddleware";
import asyncHandler from "../../../utils/asyncHandler";
import * as bankDetails from "../../../controllers/manageBankDetails/bankDetailsControllers"

const router = Router();

router.get("/fetchBankDetails",
    authenticate ,authorizeAdmin,
    // checkPermission("View Bank Details"),
    asyncHandler(bankDetails.getBankDetails));

router.put("/editBankDetails/:visaTypeName", 
authenticate ,authorizeAdmin,
    // checkPermission("Edit Bank Details"),
 asyncHandler(bankDetails.editBankDetails))
