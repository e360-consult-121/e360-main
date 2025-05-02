import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../../../middlewares/authenticate";
import asyncHandler from "../../../utils/asyncHandler";
import * as bankDetails from "../../../controllers/manageBankDetails/bankDetailsControllers"

const router = Router();

router.get("/fetchBankDetails", authenticate ,authorizeAdmin, asyncHandler(bankDetails.getBankDetails))
router.put("/editBankDetails/:visaTypeName", authenticate ,authorizeAdmin, asyncHandler(bankDetails.editBankDetails))

export default router;